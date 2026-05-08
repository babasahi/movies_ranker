import { useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';

interface Props {
  isVisible: boolean;
}

export function TrashZone({ isVisible }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: 'trash' });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border-2 border-dashed flex items-center justify-center gap-2 transition-all duration-200 ${
        !isVisible
          ? 'h-0 py-0 overflow-hidden border-transparent opacity-0'
          : isOver
          ? 'h-14 py-4 border-red-500 bg-red-950/40 text-red-400'
          : 'h-14 py-4 border-zinc-700 text-zinc-500'
      }`}
    >
      <Trash2 size={18} />
      <span className="text-sm font-medium">Drop here to remove</span>
    </div>
  );
}
