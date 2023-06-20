import type {
  TrackedMapSlice,
  UntrackedLayers,
  UntrackedMapSlice,
  UntrackedMapState,
} from './MapStoreTypes';
import { LayerType } from '@/bindings/definitions';
import Konva from 'konva';
import { createRef } from 'react';
import { StateCreator } from 'zustand';

const LAYER_TYPES = Object.values(LayerType);

export const UNTRACKED_DEFAULT_STATE: UntrackedMapState = {
  mapId: -1,
  selectedLayer: {
    id: -1,
    is_alternative: false,
    name: 'none',
    type_: LayerType.Base,
    map_id: -1,
  },
  layers: {
    ...LAYER_TYPES.reduce(
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
> = (set, get) => ({
  untrackedState: UNTRACKED_DEFAULT_STATE,
  stageRef: createRef<Konva.Stage>(),
  updateSelectedLayer(selectedLayer) {
    // Clear the transformer's nodes.
    get().transformer.current?.nodes([]);

    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        selectedLayer: {
          ...selectedLayer,
        },
        layers: {
          ...state.untrackedState.layers,
          plants: {
            ...state.untrackedState.layers.plants,
            selectedPlanting: null,
            selectedPlantForPlanting: null,
          },
        },
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
          plants: {
            ...state.untrackedState.layers.plants,
            selectedPlanting: null,
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
          plants: {
            ...state.untrackedState.layers.plants,
            selectedPlantForPlanting: null,
            selectedPlanting: planting,
          },
        },
      },
    }));
  },
});
