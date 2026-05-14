# The Great Split

The Great Split is a Next.js 14 app that curates popular films into an editorial, cinematic discovery experience. It pulls live data from TMDB and presents a spotlight feature, a featured rail, and a curated grid, with a detailed dossier view per title.

## Features

- Spotlight hero with a featured film and editorial summary
- Featured rail and curated grid of popular titles
- Movie detail pages with runtime, genres, and metadata
- Graceful TMDB error handling and fallback artwork
- Incremental data refresh using Next.js revalidation

## Tech Stack

- Next.js (App Router)
- TMDB API
- CSS (custom global styling)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env.local`:

```bash
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
# or
TMDB_API_KEY=your_tmdb_api_key
```

3. Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Notes

- You can update the home experience in `src/app/page.js`.
- Movie detail layout lives in `src/app/movie/[id]/page.js`.
- TMDB calls are implemented in `src/lib/tmdb.js`.
