import { Movie, ListSize } from '../types';
import { RankedItem } from './RankedItem';
import { TrashZone } from './TrashZone';

interface Props {
  movies: Movie[];
  maxSize: ListSize;
  onRemove: (id: number) => void;
  isDragging: boolean;
}

export function RankedList({ movies, maxSize, onRemove, isDragging }: Props) {
  const emptySlots = maxSize - movies.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Your List</h2>
        <span className="text-sm text-zinc-500">
          {movies.length}
          <span className="text-zinc-700">/{maxSize}</span>
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {movies.map((movie, index) => (
          <RankedItem
            key={movie.id}
            movie={movie}
            rank={index + 1}
            onRemove={onRemove}
          />
        ))}

        {Array.from({ length: emptySlots }, (_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center gap-3 px-3 py-2.5 border border-dashed border-zinc-800 rounded-lg min-h-[52px]"
          >
            <div className="w-5 shrink-0" />
            <span className="text-zinc-700 font-bold text-sm w-6 text-center">
              {movies.length + i + 1}
            </span>
            <span className="text-zinc-700 text-xs">Click + to add a movie</span>
          </div>
        ))}
      </div>

      <TrashZone isVisible={isDragging} />

      {movies.length > 0 && !isDragging && (
        <p className="text-zinc-600 text-xs text-center mt-1">
          Drag to reorder · hover to remove
        </p>
      )}
    </div>
  );
}
