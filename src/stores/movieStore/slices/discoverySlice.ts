import type { StateCreator } from 'zustand';

export type DiscoverySlice = {
  isDiscoveryMode: boolean;
  toggleDiscoveryMode: () => void;
  setDiscoveryMode: (enabled: boolean) => void;
};

export const createDiscoverySlice: StateCreator<DiscoverySlice, [], [], DiscoverySlice> = (set) => ({
  isDiscoveryMode: false,

  toggleDiscoveryMode: () => set((state) => ({ isDiscoveryMode: !state.isDiscoveryMode })),

  setDiscoveryMode: (isDiscoveryMode) => set({ isDiscoveryMode }),
});
