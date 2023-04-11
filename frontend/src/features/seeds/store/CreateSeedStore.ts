import { NewSeedDto } from '../../../bindings/definitions';
import { createSeed } from '../api/createSeed';
import { findAllPlants } from '../api/findAllPlants';
import { searchPlants } from '../api/searchPlants';
import { PlantsSummaryDto } from '@/bindings/definitions';
import { create } from 'zustand';

interface CreateSeedState {
  isUploadingSeed: boolean;
  isFetchingPlants: boolean;
  plants: PlantsSummaryDto[];
  error: Error | null | undefined;
  showErrorModal: boolean;
  setShowErrorModal: (showErrorModal: boolean) => void;
  findAllPlants: () => Promise<void>;
  searchPlants: (searchTerm: string, page: number) => Promise<void>;
  createSeed: (seed: NewSeedDto, successCallback?: () => void) => Promise<void>;
}

const useCreateSeedStore = create<CreateSeedState>((set) => ({
  isUploadingSeed: false,
  isFetchingPlants: false,
  plants: [],
  error: null,
  showErrorModal: false,
  setShowErrorModal: (showErrorModal) => set((state) => ({ ...state, showErrorModal })),
  createSeed: async (seed, successCallback) => {
    try {
      set((state) => ({ ...state, isUploadingSeed: true }));
      await createSeed(seed);
      set((state) => ({ ...state, isUploadingSeed: false }));
      successCallback?.();
    } catch (error) {
      console.log(error);

      set((state) => ({
        ...state,
        error: error as Error,
        showErrorModal: true,
        isUploadingSeed: false,
      }));
    }
  },
  findAllPlants: async () => {
    try {
      set((state) => ({ ...state, isFetchingPlants: true }));
      const plants = await findAllPlants();
      set((state) => ({ ...state, plants, isFetchingPlants: false }));
    } catch (error) {
      console.log(error);

      set((state) => ({
        ...state,
        error: error as Error,
        showErrorModal: true,
        isFetchingPlants: false,
      }));
    }
  },
  searchPlants: async (searchTerm: string, page: number) => {
    try {
      set((state) => ({ ...state, isFetchingPlants: true }));
      const result = await searchPlants(searchTerm, page);
      const plants = result.plants;
      const hasMore = result.has_more;
      set((state) => ({ ...state, plants, hasMore, isFetchingPlants: false }));
    } catch (error) {
      console.log(error);
      set((state) => ({
        ...state,
        error: error as Error,
        showErrorModal: true,
        isFetchingPlants: false,
      }));
    }
  },
}));

export default useCreateSeedStore;
