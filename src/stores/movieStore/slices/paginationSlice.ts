import type { StateCreator } from 'zustand';

export type PaginationSlice = {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  setTotalPages: (total: number) => void;
};

export const createPaginationSlice: StateCreator<PaginationSlice, [], [], PaginationSlice> = (set) => ({
  currentPage: 1,
  totalPages: 1,

  setPage: (currentPage) => set({ currentPage }),

  setTotalPages: (totalPages) => set({ totalPages }),
});
