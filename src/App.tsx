import { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useMovies, getPosterUrl, getPosterFallback, YearRange } from './hooks/useMovies';
import { MovieBrowser } from './components/MovieBrowser';
import { RankedList } from './components/RankedList';
import { Header } from './components/Header';
import { SetupScreen } from './components/SetupScreen';
import { Movie, ListSize } from './types';

function parseUrlState(): { rankedIds: number[]; listSize: ListSize } | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('list');
    if (!raw) return null;
    const decoded = JSON.parse(atob(raw));
    const ids = Array.isArray(decoded.ids) ? (decoded.ids as number[]) : [];
    const size: ListSize = ([5, 10, 20] as ListSize[]).includes(decoded.size)
      ? decoded.size
      : 10;
    return { rankedIds: ids, listSize: size };
  } catch {
    return null;
  }
}

const DEFAULT_SIZE: ListSize = 10;
const urlState = parseUrlState();

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-400 text-sm">Loading top 250 movies…</p>
      </div>
    </div>
  );
}

function ErrorScreen({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-4">⚠️</p>
        <h2 className="text-xl font-bold text-white mb-2">Failed to load movies</h2>
        <p className="text-zinc-400 text-sm">{error}</p>
        <p className="text-zinc-600 text-xs mt-3">
          Check your VITE_TMDB_API_KEY in the .env file and restart the dev server.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const { movies, loading, error, hasApiKey } = useMovies();

  const [rankedIds, setRankedIds] = useState<number[]>(urlState?.rankedIds ?? []);
  const [listSize, setListSize] = useState<ListSize>(urlState?.listSize ?? DEFAULT_SIZE);
  const [search, setSearch] = useState('');
  const [yearRange, setYearRange] = useState<YearRange | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  // movies added via search that aren't in the top-rated list
  const [extraMovies, setExtraMovies] = useState<Movie[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const allKnownMovies = useMemo(
    () => [...movies, ...extraMovies],
    [movies, extraMovies]
  );

  const rankedMovies = useMemo(
    () =>
      rankedIds
        .map((id) => allKnownMovies.find((m) => m.id === id))
        .filter(Boolean) as Movie[],
    [rankedIds, allKnownMovies]
  );

  const addMovie = useCallback(
    (movie: Movie) => {
      // store it so we can find it when building rankedMovies
      if (!movies.find((m) => m.id === movie.id)) {
        setExtraMovies((prev) =>
          prev.find((m) => m.id === movie.id) ? prev : [...prev, movie]
        );
      }
      setRankedIds((prev) => {
        if (prev.length >= listSize || prev.includes(movie.id)) return prev;
        return [...prev, movie.id];
      });
    },
    [listSize, movies]
  );

  const removeMovie = useCallback((id: number) => {
    setRankedIds((prev) => prev.filter((i) => i !== id));
  }, []);

  const handleListSizeChange = (newSize: ListSize) => {
    setListSize(newSize);
    setRankedIds((prev) => prev.slice(0, newSize));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    if (!over) return;

    if (String(over.id) === 'trash') {
      removeMovie(Number(active.id));
      return;
    }

    const activeId = Number(active.id);
    const overId = Number(over.id);
    setRankedIds((prev) => {
      const oldIndex = prev.indexOf(activeId);
      const newIndex = prev.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const getShareUrl = useCallback(() => {
    const payload = btoa(JSON.stringify({ ids: rankedIds, size: listSize }));
    return `${window.location.origin}${window.location.pathname}?list=${payload}`;
  }, [rankedIds, listSize]);

  if (!hasApiKey) return <SetupScreen />;
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const activeMovie = activeDragId
    ? allKnownMovies.find((m) => String(m.id) === activeDragId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-zinc-950 text-white">
        <Header
          listSize={listSize}
          onListSizeChange={handleListSizeChange}
          rankedCount={rankedIds.length}
          getShareUrl={getShareUrl}
        />

        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-6 items-start">
            <MovieBrowser
              topMovies={movies}
              rankedIds={rankedIds}
              onAdd={addMovie}
              canAdd={rankedIds.length < listSize}
              search={search}
              onSearch={setSearch}
              yearRange={yearRange}
              onYearRange={setYearRange}
            />

            <div className="lg:sticky lg:top-[61px] lg:max-h-[calc(100vh-76px)] lg:overflow-y-auto lg:pb-4">
              <SortableContext
                items={rankedIds.map(String)}
                strategy={verticalListSortingStrategy}
              >
                <RankedList
                  movies={rankedMovies}
                  maxSize={listSize}
                  onRemove={removeMovie}
                  isDragging={activeDragId !== null}
                />
              </SortableContext>
            </div>
          </div>
        </main>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeMovie && (
          <div className="flex items-center gap-3 p-2.5 bg-zinc-800 border border-amber-400/50 rounded-lg shadow-2xl w-72 opacity-95 rotate-1">
            <img
              src={getPosterUrl(activeMovie.posterPath)}
              alt={activeMovie.title}
              className="w-9 object-cover rounded shrink-0"
              style={{ height: '52px' }}
              onError={(e) => { e.currentTarget.src = getPosterFallback(); }}
            />
            <div className="min-w-0">
              <p className="font-semibold text-sm text-white truncate">{activeMovie.title}</p>
              <p className="text-zinc-400 text-xs">
                {activeMovie.year} · ★ {activeMovie.rating.toFixed(1)}
              </p>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
