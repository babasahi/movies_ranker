export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  posterPath: string | null;
  overview: string;
  rank: number;
}

export type ListSize = 5 | 10 | 20;
