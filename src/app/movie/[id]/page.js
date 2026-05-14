import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovieByIdSafe, TMDB_IMAGE_BASE } from "../../../lib/tmdb";

const fallbackPoster =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect width='500' height='750' fill='%23161a24'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23e7d8bf' font-family='sans-serif' font-size='30'%3ENo Poster%3C/text%3E%3C/svg%3E";

const getYear = (date) => (date ? date.slice(0, 4) : "N/A");
const formatRuntime = (runtime) => (runtime ? `${runtime} min` : "Runtime N/A");
const formatRating = (value) => (value ? value.toFixed(1) : "—");

const buildDescription = (movie) => {
  if (!movie?.overview) {
    return "Explore this title on Cine-Stream.";
  }

  return movie.overview.length > 156
    ? `${movie.overview.slice(0, 153)}...`
    : movie.overview;
};

export async function generateMetadata({ params }) {
  const { id } = params;
  const { data: movie, error } = await getMovieByIdSafe(id);

  if (error) {
    return {
      title: "Cine-Stream",
      description: "Movie details are temporarily unavailable.",
    };
  }

  if (!movie) {
    return {
      title: "Movie not found | Cine-Stream",
      description: "We couldn't find that movie on Cine-Stream.",
    };
  }

  const title = `${movie.title || "Movie"} (${getYear(
    movie.release_date,
  )}) | Cine-Stream`;

  return {
    title,
    description: buildDescription(movie),
  };
}

export default async function MovieDetailPage({ params }) {
  const { id } = params;
  const { data: movie, error } = await getMovieByIdSafe(id);

  if (!movie && !error) {
    notFound();
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-10">
        <nav className="mb-6 text-sm text-[color:var(--muted)]">
          <Link className="hover:text-[color:var(--ink)]" href="/">
            &larr; Back to Discover
          </Link>
        </nav>
        <section className="rounded-2xl border border-[color:var(--accent)]/40 bg-[color:var(--panel-strong)] px-5 py-4 text-[color:var(--ink)]">
          {error}
        </section>
      </main>
    );
  }

  const poster = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : fallbackPoster;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-10">
      <nav className="flex items-center justify-between text-sm text-[color:var(--muted)] reveal-1">
        <Link className="hover:text-[color:var(--ink)]" href="/">
          &larr; Back to Discover
        </Link>
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.4em]">
          Cine-Stream
        </span>
      </nav>

      <section className="grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--panel)] shadow-[var(--shadow)] hover-lift float-soft reveal-2">
          <img
            src={poster}
            alt={`${movie.title} poster`}
            className="block h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-6 text-xs uppercase tracking-[0.35em] text-white/80">
            Official Artwork
          </div>
        </div>

        <div className="space-y-8 reveal-2">
          <div className="space-y-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-[color:var(--muted)]">
              Feature dossier
            </p>
            <h1 className="font-[var(--font-display)] text-[clamp(2.4rem,4.5vw,3.6rem)] leading-[1.1] text-[color:var(--ink)]">
              {movie.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
              <span>{getYear(movie.release_date)}</span>
              <span>•</span>
              <span>{formatRuntime(movie.runtime)}</span>
              <span>•</span>
              <span>{movie.status || "Status N/A"}</span>
            </div>
          </div>

          <p className="text-[1rem] text-[color:var(--muted)]">
            {movie.overview || "No overview available for this title."}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-[color:var(--line)] bg-[color:var(--panel)] p-5 hover-lift">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Rating
              </p>
              <p className="mt-3 font-[var(--font-display)] text-3xl text-[color:var(--ink)]">
                {formatRating(movie.vote_average)}
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-[color:var(--line)] bg-[color:var(--panel)] p-5 hover-lift">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Genres
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(movie.genres || []).length ? (
                  movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-[color:var(--line)] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]"
                    >
                      {genre.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[color:var(--muted)]">
                    Genres not available
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
