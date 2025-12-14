'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

import { useMovieStore, selectGenres } from '@/stores/movieStore';
import { useFetch } from '@/hooks';
import type { Genre, GenresResponse } from '@/libs/tmdb';

export function GenreFilter() {
  const selectedGenreIds = useMovieStore(selectGenres);
  const setSelectedGenres = useMovieStore((state) => state.setGenres);

  const { data, isLoading, error, refetch } = useFetch<GenresResponse>('/api/genres');
  const genres: Genre[] = data?.genres ?? [];
  const selectedGenres = genres.filter((g) => selectedGenreIds.includes(g.id));

  if (isLoading) {
    return <div className="h-10 w-full animate-pulse rounded-lg bg-gray-700" />;
  }

  if (error) {
    return (
      <button
        onClick={refetch}
        className="flex w-full items-center justify-between rounded-lg bg-red-900/30 px-3 py-2.5 text-left text-sm"
      >
        <span className="text-red-400">Failed to load genres</span>
        <span className="text-xs text-blue-400 hover:text-blue-300">Retry</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <Listbox value={selectedGenreIds} onChange={setSelectedGenres} multiple>
        <ListboxButton className="relative w-full cursor-pointer rounded-lg bg-gray-700 py-2.5 pl-3 pr-10 text-left text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <span className="block truncate">
            {selectedGenres.length === 0
              ? 'All Genres'
              : selectedGenres.length === 1
                ? selectedGenres[0].name
                : `${selectedGenres.length} genres selected`}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </span>
        </ListboxButton>
        <ListboxOptions className="absolute z-10 mt-1 max-h-[40vh] w-full overflow-auto rounded-lg bg-gray-700 py-1 text-sm shadow-lg focus:outline-none sm:max-h-60">
          {genres.map((genre) => (
            <ListboxOption
              key={genre.id}
              value={genre.id}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                  active ? 'bg-blue-600 text-white' : 'text-gray-200'
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{genre.name}</span>
                  {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
