import { X, Calendar } from 'lucide-react';
import { YearRange } from '../hooks/useMovies';

interface Props {
  value: YearRange | null;
  onChange: (range: YearRange | null) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1919 }, (_, i) => CURRENT_YEAR - i);
const DECADES = [2020, 2010, 2000, 1990, 1980, 1970, 1960];

function decadeRange(start: number): YearRange {
  return { from: start, to: Math.min(start + 9, CURRENT_YEAR) };
}

function isDecadeActive(value: YearRange | null, decade: number): boolean {
  const r = decadeRange(decade);
  return value?.from === r.from && value?.to === r.to;
}

export function YearFilter({ value, onChange }: Props) {
  const selectedSingleYear =
    value && value.from === value.to ? value.from : null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-zinc-500 shrink-0">
        <Calendar size={14} />
        <span className="text-xs font-medium">Year</span>
      </div>

      <div className="flex gap-1 flex-wrap">
        {DECADES.map((decade) => (
          <button
            key={decade}
            onClick={() =>
              onChange(isDecadeActive(value, decade) ? null : decadeRange(decade))
            }
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              isDecadeActive(value, decade)
                ? 'bg-amber-400 text-zinc-950'
                : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
            }`}
          >
            {decade}s
          </button>
        ))}
      </div>

      <div className="relative">
        <select
          value={selectedSingleYear ?? ''}
          onChange={(e) => {
            const y = Number(e.target.value);
            onChange(y ? { from: y, to: y } : null);
          }}
          className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2.5 py-1 pr-6 appearance-none focus:outline-none focus:border-amber-400 cursor-pointer"
        >
          <option value="">Specific year…</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 text-[10px]">▾</div>
      </div>

      {value && (
        <button
          onClick={() => onChange(null)}
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X size={12} />
          Clear
        </button>
      )}
    </div>
  );
}
