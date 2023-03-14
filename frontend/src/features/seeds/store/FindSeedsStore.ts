import { SeedDto } from '../../../bindings/definitions';
import { create } from 'zustand';
import { findAllSeeds } from '../api/findAllSeeds';

interface FindSeedsStore {
  isFetchingSeeds: boolean;
  seeds: SeedDto[];
  error: Error | null | undefined;
  showErrorModal: boolean;
  setShowErrorModal: (showErrorModal: boolean) => void;
  findAllSeeds: () => Promise<void>;
}

const useFindSeedsStore = create<FindSeedsStore>((set) => ({
  isFetchingSeeds: false,
  seeds: [],
  error: null,
  showErrorModal: false,
  setShowErrorModal: (showErrorModal: boolean) => set((state) => ({ ...state, showErrorModal })),
  findAllSeeds: async () => {
    try {
      set((state) => ({ ...state, isFetchingSeeds: true }));
      const seeds = await findAllSeeds();
      set((state) => ({ ...state, seeds, isFetchingSeeds: false }));
      
    } catch (error) {
      set((state) => ({
        ...state,
        error: error as Error,
        showErrorModal: true,
        isFetchingSeeds: false,
      }));
    }
  },
}));

export default useFindSeedsStore;
