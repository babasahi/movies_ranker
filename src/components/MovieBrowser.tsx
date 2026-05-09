import { Movie } from '../types';
import { useSearch, useYearMovies, YearRange } from '../hooks/useMovies';
import { SearchBar } from './SearchBar';
import { YearFilter } from './YearFilter';
import { MovieCard } from './MovieCard';
import { Loader2 } from 'lucide-react';

interface Props {
  topMovies: Movie[];
  rankedIds: number[];
  onAdd: (movie: Movie) => void;
  canAdd: boolean;
  search: string;
  onSearch: (value: string) => void;
  yearRange: YearRange | null;
  onYearRange: (range: YearRange | null) => void;
}

export function MovieBrowser({
  topMovies, rankedIds, onAdd, canAdd,
  search, onSearch, yearRange, onYearRange,
}: Props) {
  const { results: searchResults, searching } = useSearch(search);
  const { results: yearResults, loading: yearLoading } = useYearMovies(
    search.trim() ? null : yearRange  // search takes priority over year filter
  );

  const isSearching = search.trim().length > 0;
  const isYearFiltered = !isSearching && yearRange !== null;

  let visibleMovies: Movie[];
  let heading: string;
  let subheading: string;

  if (isSearching) {
    visibleMovies = searchResults;
    heading = `Results for "${search}"`;
    subheading = `${searchResults.length} found`;
  } else if (isYearFiltered) {
    visibleMovies = yearResults;
    const label = yearRange!.from === yearRange!.to
      ? String(yearRange!.from)
      : `${yearRange!.from}–${yearRange!.to}`;
    heading = `Best movies of ${label}`;
    subheading = `${yearResults.length} found`;
  } else {
    visibleMovies = topMovies;
    heading = 'Top 250 Movies';
    subheading = `${topMovies.length} loaded`;
  }

  const busy = searching || yearLoading;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-white shrink-0">
          {heading}
          <span className="ml-2 text-zinc-500 text-sm font-normal">({subheading})</span>
        </h2>
      </div>

      <SearchBar value={search} onChange={onSearch} />
      <YearFilter value={yearRange} onChange={onYearRange} />

      {!canAdd && (
        <div className="bg-amber-900/20 border border-amber-700/40 rounded-lg px-4 py-2.5 text-sm text-amber-400 text-center">
          Your list is full — remove a movie to add another
        </div>
      )}

      {busy ? (
        <div className="flex items-center justify-center py-20 text-zinc-500 gap-2">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">{yearLoading ? 'Loading…' : 'Searching…'}</span>
        </div>
      ) : visibleMovies.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-sm">No movies found.</p>
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
