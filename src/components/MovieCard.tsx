'use client';

import Image from 'next/image';

import { getImageUrl, type Movie } from '@/libs/tmdb';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const imageUrl = getImageUrl(movie.poster_path, 'w342');
  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105 hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-700">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-opacity group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
        )}
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-sm font-medium text-yellow-400">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-white group-hover:text-blue-400">{movie.title}</h3>
        <p className="mt-1 text-xs text-gray-400">{year}</p>
      </div>
    </button>
  );
}
