import type { StateCreator } from 'zustand';

export type ModalSlice = {
  selectedMovieId: number | null;
  isModalOpen: boolean;
  openModal: (movieId: number) => void;
  closeModal: () => void;
};

export const createModalSlice: StateCreator<ModalSlice, [], [], ModalSlice> = (set) => ({
  selectedMovieId: null,
  isModalOpen: false,

  openModal: (movieId) => set({ selectedMovieId: movieId, isModalOpen: true }),

  closeModal: () => set({ selectedMovieId: null, isModalOpen: false }),
});
