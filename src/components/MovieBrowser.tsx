import { Movie } from '../types';
import { SearchBar } from './SearchBar';
import { MovieCard } from './MovieCard';

interface Props {
  movies: Movie[];
  rankedIds: number[];
  onAdd: (id: number) => void;
  canAdd: boolean;
  search: string;
  onSearch: (value: string) => void;
}

export function MovieBrowser({ movies, rankedIds, onAdd, canAdd, search, onSearch }: Props) {
  const visibleMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-white shrink-0">
          Top 250 Movies
          <span className="ml-2 text-zinc-500 text-sm font-normal">
            ({movies.length} loaded)
          </span>
        </h2>
      </div>

      <SearchBar value={search} onChange={onSearch} />

      {!canAdd && (
        <div className="bg-amber-900/20 border border-amber-700/40 rounded-lg px-4 py-2.5 text-sm text-amber-400 text-center">
          Your list is full — remove a movie to add another
        </div>
      )}

      {visibleMovies.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-sm">No movies match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {visibleMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onAdd={onAdd}
              canAdd={canAdd}
              inList={rankedIds.includes(movie.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
