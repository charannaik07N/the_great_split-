import Link from "next/link";
import { getPopularMoviesSafe, TMDB_IMAGE_BASE } from "../lib/tmdb";

const fallbackPoster =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect width='500' height='750' fill='%23161a24'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23e7d8bf' font-family='sans-serif' font-size='30'%3ENo Poster%3C/text%3E%3C/svg%3E";

const formatRating = (value) => (value ? value.toFixed(1) : "—");
const getYear = (date) => (date ? date.slice(0, 4) : "—");

export default async function Home() {
  const { data, error } = await getPopularMoviesSafe(1);
  const movies = data?.results ?? [];
  const spotlight = movies[0];
  const featured = movies.slice(1, 5);
  const gridMovies = movies.slice(5, 17);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6 lg:px-10">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-3 reveal-1">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.5em] text-[color:var(--muted)]">
            The Great Split
          </p>
          <h1 className="font-[var(--font-display)] text-[clamp(2.6rem,6vw,4.2rem)] leading-[1.05] text-[color:var(--ink)]">
            Cinema, surfaced with editorial precision.
          </h1>
          <p className="max-w-xl text-[1rem] text-[color:var(--muted)]">
            For buffs who want the pulse of the box office and the elegance of a
            curated shelf. Updated daily, designed to be skimmed fast.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 reveal-2">
          {["Now Showing", "Festival Radar", "Critical Darlings"].map(
            (label) => (
              <span
                key={label}
                className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel)] px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[color:var(--muted)]"
              >
                {label}
              </span>
            ),
          )}
        </div>
      </header>

      {error ? (
        <section className="rounded-2xl border border-[color:var(--accent)]/40 bg-[color:var(--panel-strong)] px-5 py-4 text-sm text-[color:var(--ink)]">
          {error}
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--panel)] p-6 shadow-[var(--shadow)] sm:p-8 reveal-2">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-[color:var(--muted)]">
            Spotlight
          </p>
          {spotlight ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="space-y-4">
                <h2 className="font-[var(--font-display)] text-[clamp(2rem,3vw,2.6rem)] text-[color:var(--ink)]">
                  {spotlight.title}
                </h2>
                <p className="text-sm text-[color:var(--muted)]">
                  {getYear(spotlight.release_date)} · Rating{" "}
                  {formatRating(spotlight.vote_average)}
                </p>
                <p className="text-[0.95rem] text-[color:var(--muted)]">
                  {spotlight.overview ||
                    "A defining cinematic moment worth your full attention."}
                </p>
                <Link
                  href={`/movie/${spotlight.id}`}
                  className="inline-flex items-center gap-3 rounded-full border border-[color:var(--ink)] px-5 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)] transition hover:-translate-y-0.5 hover:bg-[color:var(--ink)] hover:text-[color:var(--canvas)]"
                >
                  Explore Feature
                </Link>
              </div>
              <Link
                href={`/movie/${spotlight.id}`}
                className="group relative overflow-hidden rounded-[1.6rem] border border-[color:var(--line)] hover-lift float-soft"
              >
                <img
                  src={
                    spotlight.poster_path
                      ? `${TMDB_IMAGE_BASE}${spotlight.poster_path}`
                      : fallbackPoster
                  }
                  alt={`${spotlight.title} poster`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[color:var(--muted)]">
              Spotlight content will appear once TMDB is reachable.
            </p>
          )}
        </div>

        <aside className="grid gap-4 reveal-3">
          {featured.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group flex items-center gap-4 rounded-[1.4rem] border border-[color:var(--line)] bg-[color:var(--panel)] p-4 shadow-[var(--shadow)] hover-lift"
            >
              <img
                src={
                  movie.poster_path
                    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
                    : fallbackPoster
                }
                alt={`${movie.title} poster`}
                className="h-20 w-14 rounded-lg object-cover"
              />
              <div className="space-y-1">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[color:var(--muted)]">
                  Featured
                </p>
                <h3 className="text-sm font-semibold text-[color:var(--ink)]">
                  {movie.title}
                </h3>
                <p className="text-xs text-[color:var(--muted)]">
                  {getYear(movie.release_date)} ·{" "}
                  {formatRating(movie.vote_average)}
                </p>
              </div>
            </Link>
          ))}
        </aside>
      </section>

      <section className="space-y-6 reveal-2">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-[color:var(--muted)]">
              Curated lane
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-[clamp(1.8rem,3vw,2.4rem)] text-[color:var(--ink)]">
              Popular right now
            </h2>
          </div>
          <p className="text-sm text-[color:var(--muted)]">
            {movies.length} titles in rotation
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gridMovies.map((movie, index) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className={`group overflow-hidden rounded-[1.6rem] border border-[color:var(--line)] bg-[color:var(--panel)] shadow-[var(--shadow)] hover-lift ${
                index % 4 === 0 ? "lg:col-span-2" : ""
              }`}
            >
              <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,160px)_minmax(0,1fr)]">
                <img
                  src={
                    movie.poster_path
                      ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
                      : fallbackPoster
                  }
                  alt={`${movie.title} poster`}
                  className="aspect-[2/3] w-full rounded-xl object-cover"
                />
                <div className="space-y-3">
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
                      Cine-Stream
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[color:var(--ink)]">
                      {movie.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[color:var(--muted)]">
                    {getYear(movie.release_date)} · Rating{" "}
                    {formatRating(movie.vote_average)}
                  </p>
                  <p className="text-sm text-[color:var(--muted)] line-clamp-3">
                    {movie.overview ||
                      "A standout entry curated for serious film lovers."}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
