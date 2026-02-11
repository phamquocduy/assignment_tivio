'use client';

import { CURRENT_YEAR, MIN_YEAR } from '@/constants';
import { useMovieStore, selectYearRange } from '@/stores/movieStore';
import { toIntBase10 } from '@/utils';

export function YearRangeFilter() {
  const yearRange = useMovieStore(selectYearRange);
  const setYearRange = useMovieStore((state) => state.setYearRange);
  
  const [startYear, endYear] = yearRange;

  const handleStartChange = (value: number) => {
    const newStart = Math.max(MIN_YEAR, Math.min(value, endYear));
    setYearRange([newStart, endYear]);
  };

  const handleEndChange = (value: number) => {
    const newEnd = Math.min(CURRENT_YEAR, Math.max(value, startYear));
    setYearRange([startYear, newEnd]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 xs:flex-row xs:items-center">
        <div className="flex-1">
          <input
            type="number"
            min={MIN_YEAR}
            max={endYear}
            value={startYear}
            onChange={(e) => handleStartChange(toIntBase10(e.target.value, MIN_YEAR))}
            className="w-full rounded-lg bg-gray-700 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="From year"
          />
        </div>
        <span className="hidden text-gray-400 xs:block">to</span>
        <div className="flex-1">
          <input
            type="number"
            min={startYear}
            max={CURRENT_YEAR}
            value={endYear}
            onChange={(e) => handleEndChange(toIntBase10(e.target.value, CURRENT_YEAR))}
            className="w-full rounded-lg bg-gray-700 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="To year"
          />
        </div>
      </div>
    </div>
  );
}
