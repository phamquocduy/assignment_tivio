import type { StateCreator } from 'zustand';

import type { MovieFilters } from '@/types';
import { DEFAULT_FILTERS } from '@/constants';
import type { PaginationSlice } from './paginationSlice';

export type FilterSlice = {
  filters: MovieFilters;
  setGenres: (genres: number[]) => void;
  setYearRange: (range: [number, number]) => void;
  setMinRating: (rating: number) => void;
  resetFilters: () => void;
};

export const createFilterSlice: StateCreator<FilterSlice & PaginationSlice, [], [], FilterSlice> = (set) => ({
  filters: DEFAULT_FILTERS,

  setGenres: (genres) =>
    set((state) => ({
      filters: { ...state.filters, genres },
      currentPage: 1,
    })),

  setYearRange: (yearRange) =>
    set((state) => ({
      filters: { ...state.filters, yearRange },
      currentPage: 1,
    })),

  setMinRating: (minRating) =>
    set((state) => ({
      filters: { ...state.filters, minRating },
      currentPage: 1,
    })),

  resetFilters: () =>
    set({
      filters: DEFAULT_FILTERS,
      currentPage: 1,
    }),
});
