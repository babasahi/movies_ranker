import { useState, useEffect } from 'react';
import { Movie } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const BASE_URL = 'https://api.themoviedb.org/3';

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%2327272a'/%3E%3Crect x='75' y='110' width='50' height='70' rx='4' fill='%233f3f46'/%3E%3Crect x='85' y='120' width='30' height='4' rx='2' fill='%2352525b'/%3E%3Crect x='85' y='130' width='30' height='4' rx='2' fill='%2352525b'/%3E%3Crect x='85' y='140' width='20' height='4' rx='2' fill='%2352525b'/%3E%3C/svg%3E";

export function getPosterUrl(
  posterPath: string | null,
  size: 'w300' | 'w500' = 'w300'
): string {
  if (!posterPath) return PLACEHOLDER;
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}

export function getPosterFallback(): string {
  return PLACEHOLDER;
}

function buildRequest(page: number): [string, RequestInit] {
  const url = `${BASE_URL}/movie/top_rated?language=en-US&page=${page}`;
  // v4 read-access tokens are JWTs; v3 API keys are short hex strings
  if (API_KEY?.startsWith('ey')) {
    return [url, { headers: { Authorization: `Bearer ${API_KEY}` } }];
  }
  return [`${url}&api_key=${API_KEY}`, {}];
}

async function fetchPage(page: number): Promise<Omit<Movie, 'rank'>[]> {
  const res = await fetch(...buildRequest(page));
  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? 'Invalid API key. Check your VITE_TMDB_API_KEY in .env'
        : `TMDB API error: ${res.status}`
    );
  }
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.results.map((m: any) => ({
    id: m.id,
    title: m.title,
    year: m.release_date ? new Date(m.release_date).getFullYear() : 0,
    rating: Math.round(m.vote_average * 10) / 10,
    posterPath: m.poster_path ?? null,
    overview: m.overview ?? '',
  }));
}

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasApiKey = Boolean(API_KEY);

  useEffect(() => {
    if (!hasApiKey) {
      setLoading(false);
      return;
    }

    const pages = Array.from({ length: 13 }, (_, i) => i + 1);
    Promise.all(pages.map(fetchPage))
      .then((results) => {
        const all = results.flat();
        const seen = new Set<number>();
        const deduped = all.filter((m) => {
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });
        setMovies(
          deduped.slice(0, 250).map((m, i) => ({ ...m, rank: i + 1 }))
        );
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [hasApiKey]);

  return { movies, loading, error, hasApiKey };
}
