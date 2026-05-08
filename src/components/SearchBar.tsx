import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
        size={16}
      />
      <input
        type="text"
        placeholder="Search movies..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-800 text-white placeholder-zinc-500 pl-9 pr-9 py-2.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-amber-400 transition-colors text-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
