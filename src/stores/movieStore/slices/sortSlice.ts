import type { StateCreator } from 'zustand';

import type { SortOption } from '@/constants';
import { DEFAULT_SORT } from '@/constants';
import type { PaginationSlice } from './paginationSlice';

export type SortSlice = {
  sort: SortOption;
  setSort: (sort: SortOption) => void;
};

export const createSortSlice: StateCreator<SortSlice & PaginationSlice, [], [], SortSlice> = (set) => ({
  sort: DEFAULT_SORT,

  setSort: (sort) =>
    set({
      sort,
      currentPage: 1,
    }),
});
