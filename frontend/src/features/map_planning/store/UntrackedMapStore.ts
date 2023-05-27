import type {
  LayerName,
  TrackedMapSlice,
  UntrackedLayerState,
  UntrackedLayers,
  UntrackedMapSlice,
  UntrackedMapState,
} from './MapStoreTypes';
import { LAYER_NAMES } from './MapStoreTypes';
import { StateCreator } from 'zustand';

export const UNTRACKED_DEFAULT_STATE: UntrackedMapState = {
  selectedLayer: 'Base',
  layers: {
    ...LAYER_NAMES.reduce(
      (acc, layerName) => ({
        ...acc,
        [layerName]: {
          visible: true,
          opacity: 1,
        },
      }),
      {} as UntrackedLayers,
    ),
  },
};

export const createUntrackedMapSlice: StateCreator<
  TrackedMapSlice & UntrackedMapSlice,
  [],
  [],
  UntrackedMapSlice
> = (set) => ({
  untrackedState: UNTRACKED_DEFAULT_STATE,
  updateSelectedLayer: (selectedLayer: LayerName) =>
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        selectedLayer: selectedLayer,
      },
    })),
  updateLayerVisible: (layerName: LayerName, visible: UntrackedLayerState['visible']) =>
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          [layerName]: {
            ...state.untrackedState.layers[layerName],
            visible: visible,
          },
        },
      },
    })),
  updateLayerOpacity: (layerName: LayerName, opacity: UntrackedLayerState['opacity']) =>
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          [layerName]: {
            ...state.untrackedState.layers[layerName],
            opacity: opacity,
          },
        },
      },
    })),
});
