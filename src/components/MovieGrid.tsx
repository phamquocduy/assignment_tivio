'use client';

import { useEffect, useMemo } from 'react';

import {
  useMovieStore,
  selectFilters,
  selectCurrentPage,
  selectTotalPages,
  selectSort,
} from '@/stores/movieStore';
import type { Movie, MoviesResponse } from '@/libs/tmdb';
import { useFetch } from '@/hooks';

import { MovieCard } from './MovieCard';
import { CURRENT_YEAR } from '@/constants';

export function MovieGrid() {
  const filters = useMovieStore(selectFilters);
  const currentPage = useMovieStore(selectCurrentPage);
  const totalPages = useMovieStore(selectTotalPages);
  const sort = useMovieStore(selectSort);

  const setPage = useMovieStore((state) => state.setPage);
  const setTotalPages = useMovieStore((state) => state.setTotalPages);
  const openModal = useMovieStore((state) => state.openModal);

  // Build URL with query params
  const url = useMemo(() => {
    const params = new URLSearchParams({
      page: String(currentPage),
      sort,
    });

    if (filters.genres.length > 0) {
      params.set('genres', filters.genres.join(','));
    }
    if (filters.yearRange[0] > 1900 || filters.yearRange[1] < CURRENT_YEAR) {
      params.set('year_from', String(filters.yearRange[0]));
      params.set('year_to', String(filters.yearRange[1]));
    }
    if (filters.minRating > 0) {
      params.set('min_rating', String(filters.minRating));
    }

    return `/api/movies?${params.toString()}`;
  }, [currentPage, filters, sort]);

  const { data, isLoading, error, refetch } = useFetch<MoviesResponse>(url);
  const movies: Movie[] = useMemo(() => data?.results ?? [], [data]);

  useEffect(() => {
    if (data?.total_pages) {
      setTotalPages(Math.min(data.total_pages, 500)); // TMDB limits to 500 pages
    }
  }, [data, setTotalPages]);


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="mt-4 text-red-400">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] rounded-lg bg-gray-700" />
              <div className="mt-2 h-4 rounded bg-gray-700" />
              <div className="mt-1 h-3 w-1/2 rounded bg-gray-700" />
            </div>
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="py-12 text-center text-gray-400">No movies found matching your filters.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={() => openModal(movie.id)} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
