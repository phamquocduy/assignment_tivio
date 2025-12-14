'use client';

import { MAX_RATING, MIN_RATING, RATING_STEP } from '@/constants';
import { useMovieStore, selectMinRating } from '@/stores/movieStore';

export function RatingFilter() {
  const minRating = useMovieStore(selectMinRating);
  const setMinRating = useMovieStore((state) => state.setMinRating);

  return (
    <div className="flex flex-col gap-2 relative">
      <div className="flex items-center justify-between">
        <input
          type="range"
          min={MIN_RATING}
          max={MAX_RATING}
          step={RATING_STEP}
          value={minRating}
          onChange={(e) => setMinRating(parseFloat(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700 accent-blue-500"
        />
      </div>

      <div className="absolute right-0 -top-9 font-medium text-yellow-400">
        <span className="flex items-center gap-1 font-medium text-yellow-400">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {minRating.toFixed(1)}+
        </span>
      </div>
    </div>
  );
}
