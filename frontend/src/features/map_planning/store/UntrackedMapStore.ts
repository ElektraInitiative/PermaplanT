import type {
  TrackedMapSlice,
  UntrackedLayers,
  UntrackedMapSlice,
  UntrackedMapState,
} from './MapStoreTypes';
import { LAYER_NAMES } from './MapStoreTypes';
import Konva from 'konva';
import { createRef } from 'react';
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
  stageRef: createRef<Konva.Stage>(),
  updateSelectedLayer(selectedLayer) {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        selectedLayer: selectedLayer,
      },
    }));
  },
  updateLayerVisible(layerName, visible) {
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
    }));
  },
  updateLayerOpacity(layerName, opacity) {
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
    }));
  },
  selectPlantForPlanting(plant) {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          Plant: {
            ...state.untrackedState.layers.Plant,
            selectedPlantForPlanting: plant,
          },
        },
      },
    }));
  },
  selectPlanting(planting) {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          Plant: {
            ...state.untrackedState.layers.Plant,
            selectedPlanting: planting,
          },
        },
      },
    }));
  },
});
