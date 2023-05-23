import type { TrackedMapSlice, UntrackedMapSlice } from './MapStoreTypes';
import { createTrackedMapSlice } from './TrackedMapStore';
import { createUntrackedMapSlice } from './UntrackedMapStore';
import { create } from 'zustand';

const useMapStore = create<TrackedMapSlice & UntrackedMapSlice>()((...a) => ({
  ...createUntrackedMapSlice(...a),
  ...createTrackedMapSlice(...a),
}));

export default useMapStore;
