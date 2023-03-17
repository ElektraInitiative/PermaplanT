import { NewSeedDto } from '../../../bindings/definitions';
import { createSeed } from '../api/createSeed';
import { findAllPlants } from '../api/findAllPlants';
import { PlantsDto } from '@/bindings/definitions';
import { create } from 'zustand';

interface CreateSeedState {
  isUploadingSeed: boolean;
  isFetchingPlants: boolean;
  plants: PlantsDto[];
  error: Error | null | undefined;
  showErrorModal: boolean;
  setShowErrorModal: (showErrorModal: boolean) => void;
  findAllPlants: () => Promise<void>;
  createSeed: (seed: NewSeedDto) => Promise<void>;
}

const useCreateSeedStore = create<CreateSeedState>((set) => ({
  isUploadingSeed: false,
  isFetchingPlants: false,
  plants: [],
  error: null,
  showErrorModal: false,
  setShowErrorModal: (showErrorModal: boolean) => set((state) => ({ ...state, showErrorModal })),
  createSeed: async (seed: NewSeedDto) => {
    try {
      set((state) => ({ ...state, isUploadingSeed: true }));
      await createSeed(seed);
      set((state) => ({ ...state, isUploadingSeed: false }));
    } catch (error) {
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
