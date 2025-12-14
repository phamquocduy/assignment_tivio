'use client';

import { useMemo } from 'react';
import Image from 'next/image';

import { getImageUrl, type Movie, type MoviesResponse } from '@/libs/tmdb';
import { useFetch } from '@/hooks';

interface SimilarMoviesProps {
  movieId: number;
  onMovieClick: (movieId: number) => void;
}

export function SimilarMovies({ movieId, onMovieClick }: SimilarMoviesProps) {
  const { data, isLoading, error, refetch } = useFetch<MoviesResponse>(
    `/api/movies/${movieId}/similar`,
    { deps: [movieId] }
  );
  const movies: Movie[] = useMemo(() => data?.results.slice(0, 10) ?? [], [data]);

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto py-4 px-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-36 w-24 flex-shrink-0 animate-pulse rounded-lg bg-gray-700" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-red-900/20 p-3">
        <p className="text-sm text-red-400">{error}</p>
        <button
          onClick={refetch}
          className="text-sm font-medium text-blue-400 hover:text-blue-300"
        >
          Retry
        </button>
      </div>
    );
  }

  if (movies.length === 0) {
    return <p className="text-sm text-gray-400">No similar movies found.</p>;
  }

  return (
    <div className="flex gap-3 overflow-x-auto py-4 px-2">
      {movies.map((movie) => {
        const imageUrl = getImageUrl(movie.poster_path, 'w185');
        return (
          <button
            key={movie.id}
            onClick={() => onMovieClick(movie.id)}
            className="group flex-shrink-0 focus:outline-none"
          >
            <div className="relative h-36 w-24 overflow-hidden rounded-lg bg-gray-700 transition-transform group-hover:scale-105 group-hover:ring-2 group-hover:ring-blue-500">
              {imageUrl ? (
                <Image src={imageUrl} alt={movie.title} fill sizes="96px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <p className="mt-1 w-24 truncate text-xs text-gray-300 group-hover:text-blue-400">{movie.title}</p>
          </button>
        );
      })}
    </div>
  );
}
