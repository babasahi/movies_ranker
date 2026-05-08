import { useState } from 'react';
import { Film, Share2, Check } from 'lucide-react';
import { ListSize } from '../types';

interface Props {
  listSize: ListSize;
  onListSizeChange: (size: ListSize) => void;
  rankedCount: number;
  getShareUrl: () => string;
}

const SIZES: ListSize[] = [5, 10, 20];

export function Header({ listSize, onListSizeChange, rankedCount, getShareUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (rankedCount === 0) return;
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copy this link to share your list:', url);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <Film className="text-amber-400" size={26} />
          <h1 className="text-lg font-bold tracking-tight">
            Movies <span className="text-amber-400">Ranker</span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-zinc-900 rounded-lg p-1 gap-1 border border-zinc-800">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => onListSizeChange(size)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  listSize === size
                    ? 'bg-amber-400 text-zinc-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Top {size}
              </button>
            ))}
          </div>

          <button
            onClick={handleShare}
            disabled={rankedCount === 0}
            title={rankedCount === 0 ? 'Add movies to your list first' : 'Copy shareable link'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              rankedCount === 0
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : copied
                ? 'bg-green-600 text-white'
                : 'bg-amber-400 text-zinc-950 hover:bg-amber-300 active:scale-95'
            }`}
          >
            {copied ? <Check size={15} /> : <Share2 size={15} />}
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>
    </header>
  );
}
