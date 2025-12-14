'use client';

import { useMovieStore, selectFilters } from '@/stores/movieStore';
import { CURRENT_YEAR, MIN_YEAR } from '@/constants';

import { GenreFilter, YearRangeFilter, RatingFilter } from './filters';

export function FilterPanel() {
  const filters = useMovieStore(selectFilters);
  const resetFilters = useMovieStore((state) => state.resetFilters);

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.minRating > 0 ||
    filters.yearRange[0] > MIN_YEAR ||
    filters.yearRange[1] < CURRENT_YEAR;

  return (
    <div className="rounded-xl bg-gray-800/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Filters</h2>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="text-sm text-blue-400 hover:text-blue-300">
            Reset All
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-300">Genres</label>
          <GenreFilter />
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-300">Release Year</label>
          <YearRangeFilter />
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-300">Rating</label>
          <RatingFilter />
        </div>
      </div>
    </div>
  );
}
