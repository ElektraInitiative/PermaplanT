import type { TrackedMapSlice, UntrackedMapSlice } from './MapStoreTypes';
import { createTrackedMapSlice } from './TrackedMapStore';
import { createUntrackedMapSlice } from './UntrackedMapStore';
import { create } from 'zustand';

/**
 * This is the main store for the map planning feature.
 * It is composed of two sub-stores:
 * - `TrackedMapStore`: stores the state of the map that is tracked by the history.
 *  This state is used to undo/redo actions.
 *
 * - `UntrackedMapStore`: stores the state of the map that is not tracked by the history
 * (e.g. the selected layer and the layer opacities).
 */
const useMapStore = create<TrackedMapSlice & UntrackedMapSlice>()((...a) => ({
  ...createUntrackedMapSlice(...a),
  ...createTrackedMapSlice(...a),
}));

export default useMapStore;
