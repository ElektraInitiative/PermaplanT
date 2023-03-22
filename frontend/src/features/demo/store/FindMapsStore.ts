import { MapDto } from '../../../bindings/definitions';
import { findAllMaps } from '../api/findAllMaps';
import { findMapById } from '../api/findMapById';
import { create } from 'zustand';

interface FindMapsStore {
  isFetchingMaps: boolean;
  maps: MapDto[];
  map: MapDto | null;
  error: Error | null | undefined;
  showErrorModal: boolean;
  setShowErrorModal: (showErrorModal: boolean) => void;
  findAllMaps: () => Promise<void>;
  findMapById: (id: string) => Promise<void>;
}

const useFindMapsStore = create<FindMapsStore>((set) => ({
  isFetchingMaps: false,
  maps: [],
  map: null,
  error: null,
  showErrorModal: false,
  setShowErrorModal: (showErrorModal: boolean) => set((state) => ({ ...state, showErrorModal })),
  findAllMaps: async () => {
    try {
      set((state) => ({ ...state, isFetchingMaps: true }));
      const maps = await findAllMaps();
      set((state) => ({ ...state, maps, isFetchingMaps: false }));
    } catch (error) {
      set((state) => ({
        ...state,
        error: error as Error,
        showErrorModal: true,
        isFetchingMaps: false,
      }));
    }
  },
  findMapById: async (id: string) => {
    try {
      set((state) => ({ ...state, isFetchingMaps: true }));
      const map = await findMapById(id);
      set((state) => ({ ...state, map, isFetchingMaps: false }));
    } catch (error) {
      set((state) => ({
        ...state,
        error: error as Error,
        showErrorModal: true,
        isFetchingMaps: false,
      }));
    }
  },
}));

export default useFindMapsStore;
