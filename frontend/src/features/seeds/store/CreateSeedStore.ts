import { NewSeedDto } from '../../../bindings/definitions';
import { createSeed } from '../api/createSeed';
import { findAllPlants } from '../api/findAllPlants';
import { searchPlants } from '../api/searchPlants';
import { PlantsSummaryDto } from '@/bindings/definitions';
import { toast } from 'react-toastify';
import { create } from 'zustand';

interface CreateSeedState {
  isUploadingSeed: boolean;
  isFetchingPlants: boolean;
  plants: PlantsSummaryDto[];
  findAllPlants: (errorMessage: string) => Promise<void>;
  searchPlants: (searchTerm: string, pageNumber: number, errorMessage: string) => Promise<void>;
  createSeed: (
    seed: NewSeedDto,
    errorMessage: string,
    successCallback?: () => void,
  ) => Promise<void>;
}

const useCreateSeedStore = create<CreateSeedState>((set) => ({
  isUploadingSeed: false,
  isFetchingPlants: false,
  plants: [],
  createSeed: async (seed, errorMessage, successCallback) => {
    try {
      set((state) => ({ ...state, isUploadingSeed: true }));
      await createSeed(seed);
      set((state) => ({ ...state, isUploadingSeed: false }));
      successCallback?.();
    } catch (error) {
      console.log(error);
      toast.error(errorMessage);

      set((state) => ({
        ...state,
        isUploadingSeed: false,
      }));
    }
  },
  findAllPlants: async (errorMessage) => {
    try {
      set((state) => ({ ...state, isFetchingPlants: true }));
      const plants = await findAllPlants();
      set((state) => ({ ...state, plants, isFetchingPlants: false }));
    } catch (error) {
      console.log(error);
      toast.error(errorMessage);

      set((state) => ({
        ...state,
        isFetchingPlants: false,
      }));
    }
  },
  searchPlants: async (searchTerm: string, pageNumber: number, errorMessage) => {
    try {
      set((state) => ({ ...state, isFetchingPlants: true }));
      const page = await searchPlants(searchTerm, pageNumber);
      const plants = page.results;
      const hasMore = page.total_pages > pageNumber;
      set((state) => ({ ...state, plants, hasMore, isFetchingPlants: false }));
    } catch (error) {
      console.log(error);
      toast.error(errorMessage);

      set((state) => ({
        ...state,
        isFetchingPlants: false,
      }));
    }
  },
}));

export default useCreateSeedStore;
