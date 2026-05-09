import { Movie } from '../types';
import { useSearch } from '../hooks/useMovies';
import { SearchBar } from './SearchBar';
import { MovieCard } from './MovieCard';
import { Loader2 } from 'lucide-react';

interface Props {
  topMovies: Movie[];
  rankedIds: number[];
  onAdd: (movie: Movie) => void;
  canAdd: boolean;
  search: string;
  onSearch: (value: string) => void;
}

export function MovieBrowser({ topMovies, rankedIds, onAdd, canAdd, search, onSearch }: Props) {
  const { results: searchResults, searching } = useSearch(search);

  const isSearching = search.trim().length > 0;
  const visibleMovies = isSearching ? searchResults : topMovies;
  const heading = isSearching ? `Results for "${search}"` : 'Top 250 Movies';
  const subheading = isSearching
    ? `${searchResults.length} found`
    : `${topMovies.length} loaded`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-white shrink-0">
          {heading}
          <span className="ml-2 text-zinc-500 text-sm font-normal">({subheading})</span>
        </h2>
      </div>

      <SearchBar value={search} onChange={onSearch} />

      {!canAdd && (
        <div className="bg-amber-900/20 border border-amber-700/40 rounded-lg px-4 py-2.5 text-sm text-amber-400 text-center">
          Your list is full — remove a movie to add another
        </div>
      )}

      {searching ? (
        <div className="flex items-center justify-center py-20 text-zinc-500 gap-2">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Searching…</span>
        </div>
      ) : visibleMovies.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-sm">
            {isSearching ? 'No movies found.' : 'No movies loaded yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {visibleMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onAdd={() => onAdd(movie)}
              canAdd={canAdd}
              inList={rankedIds.includes(movie.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
