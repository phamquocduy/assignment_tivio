import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createFilterSlice,
  createPaginationSlice,
  createModalSlice,
  createDiscoverySlice,
  createSortSlice,
  type FilterSlice,
  type PaginationSlice,
  type ModalSlice,
  type DiscoverySlice,
  type SortSlice,
} from './slices';

export type MovieStore = FilterSlice & PaginationSlice & ModalSlice & DiscoverySlice & SortSlice;

export const useMovieStore = create<MovieStore>()(
  devtools(
    (...a) => ({
      ...createFilterSlice(...a),
      ...createPaginationSlice(...a),
      ...createModalSlice(...a),
      ...createDiscoverySlice(...a),
      ...createSortSlice(...a),
    }),
    { name: 'MovieStore' }
  )
);

// Filters
export const selectFilters = (state: MovieStore) => state.filters;
export const selectGenres = (state: MovieStore) => state.filters.genres;
export const selectYearRange = (state: MovieStore) => state.filters.yearRange;
export const selectMinRating = (state: MovieStore) => state.filters.minRating;

// Pagination
export const selectCurrentPage = (state: MovieStore) => state.currentPage;
export const selectTotalPages = (state: MovieStore) => state.totalPages;

// Modal
export const selectSelectedMovieId = (state: MovieStore) => state.selectedMovieId;
export const selectIsModalOpen = (state: MovieStore) => state.isModalOpen;

// Discovery mode
export const selectIsDiscoveryMode = (state: MovieStore) => state.isDiscoveryMode;

// Sort
export const selectSort = (state: MovieStore) => state.sort;
