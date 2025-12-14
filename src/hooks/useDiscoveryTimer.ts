'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

import { useMovieStore, selectIsDiscoveryMode, selectIsModalOpen, selectCurrentPage } from '@/stores/movieStore';
import { DEFAULT_TIMER_DURATION } from '@/constants';

export function useDiscoveryTimer() {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMER_DURATION);

  const isDiscoveryMode = useMovieStore(selectIsDiscoveryMode);
  const isModalOpen = useMovieStore(selectIsModalOpen);
  const currentPage = useMovieStore(selectCurrentPage);
  const setPage = useMovieStore((state) => state.setPage);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const shouldRefreshRef = useRef(false);

  const triggerRefresh = useCallback(() => {
    // Go to next page or back to 1
    // Page change updates URL → useFetch automatically refetches
    const nextPage = currentPage < 10 ? currentPage + 1 : 1;
    setPage(nextPage);
  }, [currentPage, setPage]);

  // Handle refresh when timer expires (outside of render cycle)
  useEffect(() => {
    if (shouldRefreshRef.current) {
      shouldRefreshRef.current = false;
      triggerRefresh();
      setTimeLeft(DEFAULT_TIMER_DURATION);
    }
  }, [timeLeft, triggerRefresh]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only run timer if discovery mode is on and modal is closed
    if (isDiscoveryMode && !isModalOpen) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Flag for refresh, will be handled in useEffect
            shouldRefreshRef.current = true;
            return 0;
          }
          
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isDiscoveryMode, isModalOpen]);

  // Reset timer when discovery mode is toggled on
  useEffect(() => {
    if (isDiscoveryMode) {
      setTimeLeft(DEFAULT_TIMER_DURATION);
      shouldRefreshRef.current = false;
    }
  }, [isDiscoveryMode]);

  return {
    timeLeft,
    totalTime: DEFAULT_TIMER_DURATION,
    isActive: isDiscoveryMode && !isModalOpen,
    isPaused: isDiscoveryMode && isModalOpen,
  };
}
