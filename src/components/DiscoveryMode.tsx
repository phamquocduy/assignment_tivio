'use client';

import { useMovieStore, selectIsDiscoveryMode } from '@/stores/movieStore';
import { useDiscoveryTimer } from '@/hooks';
import { DEFAULT_TIMER_DURATION } from '@/constants';

export function DiscoveryMode() {
  const isDiscoveryMode = useMovieStore(selectIsDiscoveryMode);
  const toggleDiscoveryMode = useMovieStore((state) => state.toggleDiscoveryMode);
  const { timeLeft, totalTime, isActive, isPaused } = useDiscoveryTimer();

  return (
    <div className="rounded-xl bg-gray-800/50 p-4 pr-2">
      <div className="flex justify-between gap-2">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">Discovery Mode</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            {isDiscoveryMode
              ? isPaused
                ? 'Paused while viewing movie'
                : 'Auto-refreshing movies'
              : `Auto-discover new movies every ${DEFAULT_TIMER_DURATION}s`}
          </p>
        </div>

        <div className="flex items-center gap-4 flex-col w-16">
          <button
            onClick={toggleDiscoveryMode}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              isDiscoveryMode ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                isDiscoveryMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>

          <div className={`transition-opacity duration-300 ${isDiscoveryMode ? 'opacity-100' : 'opacity-0'}`}>
            <CountdownRing timeLeft={timeLeft} totalTime={totalTime} isActive={isActive} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CountdownRing({ timeLeft, totalTime, isActive }: { timeLeft: number; totalTime: number; isActive: boolean }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / totalTime) * circumference;

  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <svg className="h-14 w-14 -rotate-90 transform">
        {/* Background circle */}
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className={`transition-all duration-1000 ${isActive ? 'text-blue-500' : 'text-gray-500'}`}
        />
      </svg>
      <span className="absolute text-sm font-bold text-white">{timeLeft}</span>
    </div>
  );
}
