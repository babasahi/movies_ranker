---
name: Movies Ranker project
description: Movies Ranker app — tech stack, setup, and Netlify deploy instructions
type: project
---

Full-stack details for the Movies Ranker web app at /Users/babesalehdahi/Projects/React/movies_ranker.

**Stack:** Vite + React 18 + TypeScript + Tailwind CSS v3 + @dnd-kit (drag-and-drop)

**Data source:** TMDB API (free key required) — fetches 13 pages × 20 movies = top 250 rated movies.

**API key setup:** Create `.env` with `VITE_TMDB_API_KEY=...`. Without it, a SetupScreen guides the user.

**Key features:**
- Top 250 movie browser with search filter
- Top 5 / 10 / 20 ranked list switcher
- Click "+" on any movie card to add it to the ranked list
- Drag-and-drop reordering within the ranked list (useSortable / SortableContext)
- Drag to trash zone to remove a movie
- Share list via URL (base64-encoded movie IDs in `?list=` param)

**Netlify deploy:** `npm run build`, publish `dist/`, add `VITE_TMDB_API_KEY` as env var in Netlify UI.

**Why:** Built from scratch based on readme.md description.
