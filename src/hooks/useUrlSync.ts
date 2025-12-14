'use client';

import { useEffect, useRef, useCallback } from 'react';

import { useMovieStore } from '@/stores/movieStore';
import { MIN_YEAR, CURRENT_YEAR, MIN_RATING, MAX_RATING, DEFAULT_RATING, DEFAULT_SORT, SortOption } from '@/constants';

/**
 * Hook to sync Zustand store state with URL parameters
 * - Reads URL on mount and updates store
 * - Updates URL when store changes (debounced)
 * - Handles browser back/forward navigation
 */
export function useUrlSync() {
  const isInitializedRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get store state and actions
  const filters = useMovieStore((state) => state.filters);
  const currentPage = useMovieStore((state) => state.currentPage);
  const sort = useMovieStore((state) => state.sort);
  const selectedMovieId = useMovieStore((state) => state.selectedMovieId);

  const setGenres = useMovieStore((state) => state.setGenres);
  const setYearRange = useMovieStore((state) => state.setYearRange);
  const setMinRating = useMovieStore((state) => state.setMinRating);
  const setPage = useMovieStore((state) => state.setPage);
  const setSort = useMovieStore((state) => state.setSort);
  const openModal = useMovieStore((state) => state.openModal);

  /**
   * Apply URL params to store (only for params that exist in URL)
   */
  const applyUrlToStore = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const parsed = parseUrlParams(searchParams);

    // Only update store for values explicitly present in URL
    if (parsed.genres !== undefined) setGenres(parsed.genres);
    if (parsed.yearRange !== undefined) setYearRange(parsed.yearRange);
    if (parsed.minRating !== undefined) setMinRating(parsed.minRating);
    if (parsed.page !== undefined) setPage(parsed.page);
    if (parsed.sort !== undefined) setSort(parsed.sort);

    // Handle modal state
    if (parsed.movieId) {
      openModal(parsed.movieId);
    }
  }, [setGenres, setYearRange, setMinRating, setPage, setSort, openModal]);

  /**
   * Update URL from current store state (debounced)
   */
  const updateUrlFromStore = useCallback(() => {
    if (!isInitializedRef.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce URL updates after 150ms
    debounceTimerRef.current = setTimeout(() => {
      const urlParams = buildUrlParams({
        genres: filters.genres,
        yearRange: filters.yearRange,
        minRating: filters.minRating,
        page: currentPage,
        sort,
        movieId: selectedMovieId,
      });

      // Only update if URL actually changed
      const newUrl = urlParams ? `?${urlParams}` : window.location.pathname;
      if (window.location.search !== (urlParams ? `?${urlParams}` : '')) {
        window.history.replaceState(null, '', newUrl);
      }
    }, 150);
  }, [filters, currentPage, sort, selectedMovieId]);

  // Initialize from URL on mount
  useEffect(() => {
    if (!isInitializedRef.current) {
      applyUrlToStore();
      isInitializedRef.current = true;
    }
  }, [applyUrlToStore]);

  // Update URL when store state changes
  useEffect(() => {
    updateUrlFromStore();
  }, [updateUrlFromStore]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      applyUrlToStore();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [applyUrlToStore]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
}


// Valid sort options for validation
const VALID_SORT_OPTIONS = Object.values(SortOption);

/**
 * Parses URL search params and returns validated filter state.
 * Only includes values for params that are explicitly present in the URL.
 */
function parseUrlParams(searchParams: URLSearchParams) {
  const result: {
    genres?: number[];
    yearRange?: [number, number];
    minRating?: number;
    page?: number;
    sort?: SortOption;
    movieId?: number | null;
  } = {};

  // Parse genres (comma-separated IDs) - only if present
  const genresParam = searchParams.get('genres');
  if (genresParam) {
    result.genres = genresParam
      .split(',')
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id) && id > 0);
  }

  // Parse year range - only if at least one is present
  const yearFromParam = searchParams.get('year_from');
  const yearToParam = searchParams.get('year_to');
  if (yearFromParam || yearToParam) {
    const yearFrom = yearFromParam ? parseInt(yearFromParam, 10) : MIN_YEAR;
    const yearTo = yearToParam ? parseInt(yearToParam, 10) : CURRENT_YEAR;
    const validYearFrom = Math.max(MIN_YEAR, Math.min(yearFrom, CURRENT_YEAR));
    const validYearTo = Math.max(validYearFrom, Math.min(yearTo, CURRENT_YEAR));
    result.yearRange = [validYearFrom, validYearTo];
  }

  // Parse min rating - only if present
  const minRatingParam = searchParams.get('min_rating');
  if (minRatingParam) {
    const minRating = parseFloat(minRatingParam);
    result.minRating = Math.max(MIN_RATING, Math.min(minRating, MAX_RATING));
  }

  // Parse page - only if present
  const pageParam = searchParams.get('page');
  if (pageParam) {
    const page = parseInt(pageParam, 10);
    result.page = Math.max(1, page);
  }

  // Parse sort - only if present and valid
  const sortParam = searchParams.get('sort') as SortOption | null;
  if (sortParam && VALID_SORT_OPTIONS.includes(sortParam)) {
    result.sort = sortParam;
  }

  // Parse movie ID for modal
  const movieParam = searchParams.get('movie');
  if (movieParam) {
    const movieId = parseInt(movieParam, 10);
    if (!isNaN(movieId) && movieId > 0) {
      result.movieId = movieId;
    }
  }

  return result;
}

/**
 * Builds URL search params from current state
 */
function buildUrlParams(state: {
  genres: number[];
  yearRange: [number, number];
  minRating: number;
  page: number;
  sort: SortOption;
  movieId: number | null;
}): string {
  const params = new URLSearchParams();

  // Only add non-default values to keep URL clean
  if (state.genres.length > 0) {
    params.set('genres', state.genres.join(','));
  }

  if (state.yearRange[0] !== MIN_YEAR || state.yearRange[1] !== CURRENT_YEAR) {
    params.set('year_from', String(state.yearRange[0]));
    params.set('year_to', String(state.yearRange[1]));
  }

  if (state.minRating !== DEFAULT_RATING) {
    params.set('min_rating', String(state.minRating));
  }

  if (state.page > 1) {
    params.set('page', String(state.page));
  }

  if (state.sort !== DEFAULT_SORT) {
    params.set('sort', state.sort);
  }

  if (state.movieId) {
    params.set('movie', String(state.movieId));
  }

  return params.toString();
}
