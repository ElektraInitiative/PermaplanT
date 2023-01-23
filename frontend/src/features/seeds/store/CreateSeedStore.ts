import { create } from 'zustand';

interface CreateSeedLoadingState {
  isUploadingSeed: boolean;
  isFetchingVarieties: boolean;
  updateIsUploadingSeed: (isUploadingSeed: boolean) => void;
  updateIsFetchingVarieties: (updateIsFetchingVarieties: boolean) => void;
}

const useCreateSeedLoadingStore = create<CreateSeedLoadingState>((set) => ({
  isUploadingSeed: false,
  isFetchingVarieties: false,
  updateIsUploadingSeed: (isUploadingSeed: boolean) =>
    set((state) => ({ ...state, isUploadingSeed })),
  updateIsFetchingVarieties: (isFetchingVarieties: boolean) =>
    set((state) => ({ ...state, isFetchingVarieties })),
}));

export default useCreateSeedLoadingStore;
