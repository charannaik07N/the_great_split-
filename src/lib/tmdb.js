const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const DEFAULT_LANGUAGE = "en-US";
const REQUEST_TIMEOUT_MS = 12000;
const CACHE_SECONDS = 600;

const readEnv = (key, fallbackKey) =>
  process.env[key] || (fallbackKey ? process.env[fallbackKey] : "");

const getToken = () =>
  readEnv("TMDB_READ_ACCESS_TOKEN", "VITE_TMDB_READ_ACCESS_TOKEN");

const getApiKey = () => readEnv("TMDB_API_KEY", "VITE_TMDB_API_KEY");

const buildHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const buildQuery = (params = {}) => {
  const query = new URLSearchParams({ language: DEFAULT_LANGUAGE, ...params });
  const apiKey = getApiKey();

  if (!getToken() && apiKey) {
    query.set("api_key", apiKey);
  }

  return query.toString();
};

const request = async (endpoint, params = {}) => {
  const hasToken = Boolean(getToken());
  const hasApiKey = Boolean(getApiKey());

  if (!hasToken && !hasApiKey) {
    throw new Error(
      "Missing TMDB credentials. Set TMDB_READ_ACCESS_TOKEN or TMDB_API_KEY (or VITE_TMDB_*).",
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?${buildQuery(params)}`,
      {
        headers: buildHeaders(),
        next: { revalidate: CACHE_SECONDS },
        signal: controller.signal,
      },
    );
  } catch (err) {
    const timeoutCode = err?.cause?.code;
    if (
      err?.name === "AbortError" ||
      timeoutCode === "UND_ERR_CONNECT_TIMEOUT"
    ) {
      throw new Error("TMDB request timed out. Check your network connection.");
    }

    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
};

const safeRequest = async (endpoint, params = {}) => {
  try {
    return { data: await request(endpoint, params), error: "" };
  } catch (err) {
    return { data: null, error: err?.message || "TMDB request failed." };
  }
};

export const getPopularMovies = (page = 1) =>
  request("/movie/popular", { page });

export const getMovieById = (id) => request(`/movie/${id}`);

export const searchMovies = (query, page = 1) =>
  request("/search/movie", { query, page, include_adult: false });

export const getPopularMoviesSafe = (page = 1) =>
  safeRequest("/movie/popular", { page });

export const getMovieByIdSafe = (id) => safeRequest(`/movie/${id}`);

export { TMDB_BASE_URL, TMDB_IMAGE_BASE };
