import { NewSeedDTO } from '../../../bindings/definitions';
import { VarietyDto } from '@/bindings/definitions';
import { create } from 'zustand';
import { createSeed } from '../api/createSeed';
import { findAllVarieties } from '../api/findAllVarieties';

interface CreateSeedState {
  isUploadingSeed: boolean;
  isFetchingVarieties: boolean;
  varieties: VarietyDto[];
  error: Error | null | undefined;
  showErrorModal: boolean;
  setShowErrorModal: (showErrorModal: boolean) => void;
  findAllVarieties: () => Promise<void>;
  createSeed: (seed: NewSeedDTO) => Promise<void>;
}

const useCreateSeedStore = create<CreateSeedState>((set) => ({
  isUploadingSeed: false,
  isFetchingVarieties: false,
  varieties: [],
  error: null,
  showErrorModal: false,
  setShowErrorModal: (showErrorModal: boolean) => set((state) => ({ ...state, showErrorModal })),
  createSeed: async (seed: NewSeedDTO) => {
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
  findAllVarieties: async () => {
    try {
      set((state) => ({ ...state, isFetchingVarieties: true }));
      const varieties = await findAllVarieties();
      set((state) => ({ ...state, varieties, isFetchingVarieties: false }));
    } catch (error) {
      set((state) => ({
        ...state,
        error: error as Error,
        showErrorModal: true,
        isFetchingVarieties: false,
      }));
    }
  },
}));

export default useCreateSeedStore;
