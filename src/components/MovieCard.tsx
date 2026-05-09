import { Plus } from 'lucide-react';
import { Movie } from '../types';
import { getPosterUrl, getPosterFallback } from '../hooks/useMovies';

interface Props {
  movie: Movie;
  onAdd: () => void;
  canAdd: boolean;
  inList: boolean;
}

export function MovieCard({ movie, onAdd, canAdd, inList }: Props) {
  return (
    <div
      className={`group relative bg-zinc-900 rounded-lg overflow-hidden border transition-all ${
        inList
          ? 'border-amber-500/40 opacity-50'
          : 'border-zinc-800 hover:border-zinc-600'
      }`}
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-zinc-800">
        <img
          src={getPosterUrl(movie.posterPath)}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.currentTarget.src = getPosterFallback(); }}
          loading="lazy"
        />

        {movie.rank > 0 && (
          <div className="absolute top-2 left-2 bg-zinc-950/80 text-amber-400 text-xs font-bold px-1.5 py-0.5 rounded">
            #{movie.rank}
          </div>
        )}

        <div className="absolute top-2 right-2 bg-zinc-950/80 text-amber-300 text-xs font-bold px-1.5 py-0.5 rounded">
          ★ {movie.rating.toFixed(1)}
        </div>

        {!inList && (
          <button
            onClick={onAdd}
            disabled={!canAdd}
            title={canAdd ? 'Add to your list' : 'List is full'}
            className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 ${
              canAdd
                ? 'bg-amber-400 text-zinc-950 hover:bg-amber-300 active:scale-90'
                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Plus size={16} />
          </button>
        )}

        {inList && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-amber-400 text-zinc-950 text-xs font-bold px-2 py-1 rounded">
              In your list
            </div>
          </div>
        )}
      </div>

      <div className="p-2">
        <h3 className="text-xs font-medium text-white truncate">{movie.title}</h3>
        <p className="text-xs text-zinc-500">{movie.year}</p>
      </div>
    </div>
  );
}
