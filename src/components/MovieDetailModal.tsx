'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import Image from 'next/image';

import { useMovieStore, selectSelectedMovieId, selectIsModalOpen } from '@/stores/movieStore';
import { getImageUrl, type MovieDetails } from '@/libs/tmdb';
import { useFetch } from '@/hooks';

import { SimilarMovies } from './SimilarMovies';

export function MovieDetailModal() {
  const selectedMovieId = useMovieStore(selectSelectedMovieId);
  const isModalOpen = useMovieStore(selectIsModalOpen);
  const closeModal = useMovieStore((state) => state.closeModal);
  const openModal = useMovieStore((state) => state.openModal);

  const { data: movie, isLoading, error, refetch } = useFetch<MovieDetails>(
    selectedMovieId && isModalOpen ? `/api/movies/${selectedMovieId}` : null,
    { deps: [selectedMovieId, isModalOpen] }
  );

  const handleSimilarMovieClick = (movieId: number) => {
    openModal(movieId);
  };

  const imageUrl = movie ? getImageUrl(movie.poster_path, 'w500') : null;
  const backdropUrl = movie ? getImageUrl(movie.backdrop_path, 'w780') : null;
  const year = movie?.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const runtime = movie?.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

  return (
    <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-0 sm:p-4">
          <DialogPanel className="relative w-full max-w-3xl overflow-hidden rounded-none bg-gray-900 shadow-xl sm:rounded-2xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute right-2 top-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 sm:right-4 sm:top-4"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {isLoading ? (
              <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              </div>
            ) : error ? (
              <div className="flex h-96 flex-col items-center justify-center gap-4 px-6 text-center">
                <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-red-400">{error}</p>
                <button
                  onClick={refetch}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : !movie ? (
              <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              </div>
            ) : (
              <>
                {/* Backdrop */}
                {backdropUrl && (
                  <div className="relative h-32 w-full xs:h-40 sm:h-56 md:h-64">
                    <Image src={backdropUrl} alt={movie.title} fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex flex-col gap-6 sm:flex-row">
                    {/* Poster */}
                    {imageUrl && (
                      <div className="relative mx-auto aspect-[2/3] w-32 flex-shrink-0 overflow-hidden rounded-lg shadow-lg xs:w-40 sm:mx-0 sm:-mt-24 sm:w-48">
                        <Image src={imageUrl} alt={movie.title} fill className="object-cover" priority />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1">
                      <DialogTitle className="text-2xl font-bold text-white">{movie.title}</DialogTitle>

                      {movie.tagline && (
                        <p className="mt-1 text-sm italic text-gray-400">&quot;{movie.tagline}&quot;</p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                        <span className="text-gray-300">{year}</span>
                        {runtime && (
                          <>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-300">{runtime}</span>
                          </>
                        )}
                        <span className="text-gray-500">•</span>
                        <span className="flex items-center gap-1 text-yellow-400">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>

                      {/* Genres */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {movie.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-gray-300"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>

                      {/* Overview */}
                      <p className="mt-4 text-sm leading-relaxed text-gray-300">
                        {movie.overview || 'No overview available.'}
                      </p>
                    </div>
                  </div>

                  {/* Similar Movies */}
                  <div className="mt-8">
                    <h3 className="mb-3 text-lg font-semibold text-white">Similar Movies</h3>
                    <SimilarMovies movieId={movie.id} onMovieClick={handleSimilarMovieClick} />
                  </div>
                </div>
              </>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
