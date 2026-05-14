# The Great Split

The Great Split is a Next.js 14 movie discovery experience that turns TMDB data into a cinematic, editorial-style layout. The home page highlights one spotlight title, a featured rail, and a curated grid, while each film has a detailed dossier page with runtime, genres, and key metadata.

## Live Demo

https://the-great-split.vercel.app/

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

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file and add one of the following:

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

## Project Structure

- `src/app/page.js` sets the home experience
- `src/app/movie/[id]/page.js` renders the movie detail view
- `src/lib/tmdb.js` contains TMDB API helpers
