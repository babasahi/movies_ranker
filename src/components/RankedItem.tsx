import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { Movie } from '../types';
import { getPosterUrl, getPosterFallback } from '../hooks/useMovies';

interface Props {
  movie: Movie;
  rank: number;
  onRemove: (id: number) => void;
}

export function RankedItem({ movie, rank, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: String(movie.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg group transition-opacity ${
        isDragging ? 'opacity-30' : 'opacity-100'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-zinc-600 hover:text-zinc-300 cursor-grab active:cursor-grabbing p-1 -ml-1 touch-none shrink-0"
        tabIndex={-1}
      >
        <GripVertical size={17} />
      </button>

      <div className="text-amber-400 font-bold text-base w-6 text-center shrink-0">
        {rank}
      </div>

      <img
        src={getPosterUrl(movie.posterPath)}
        alt={movie.title}
        className="w-9 h-13 object-cover rounded shrink-0 bg-zinc-700"
        style={{ height: '52px' }}
        onError={(e) => {
          e.currentTarget.src = getPosterFallback();
        }}
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-white truncate leading-tight">
          {movie.title}
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          {movie.year} · ★ {movie.rating.toFixed(1)}
        </p>
      </div>

      <button
        onClick={() => onRemove(movie.id)}
        className="text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1 shrink-0"
        title="Remove"
      >
        <X size={15} />
      </button>
    </div>
  );
}
