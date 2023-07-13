import {
  BoundsRect,
  TrackedMapSlice,
  UNTRACKED_DEFAULT_STATE,
  UntrackedMapSlice,
} from './MapStoreTypes';
import { FrontendOnlyLayerType } from '@/features/map_planning/layers/_frontend_only';
import Konva from 'konva';
import { createRef } from 'react';
import { StateCreator } from 'zustand';

export const createUntrackedMapSlice: StateCreator<
  TrackedMapSlice & UntrackedMapSlice,
  [],
  [],
  UntrackedMapSlice
> = (set, get) => ({
  untrackedState: UNTRACKED_DEFAULT_STATE,
  stageRef: createRef<Konva.Stage>(),
  tooltipRef: createRef(),
  updateMapBounds(bounds: BoundsRect) {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        editorBounds: bounds,
      },
    }));
  },
  updateSelectedLayer(selectedLayer) {
    // Clear the transformer's nodes.
    get().transformer.current?.nodes([]);

    if (typeof selectedLayer === 'object' && 'is_alternative' in selectedLayer) {
      // selectedLayer is a LayerDto
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
    }

    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        selectedLayer: selectedLayer,
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
  getSelectedLayerType() {
    const selectedLayer = get().untrackedState.selectedLayer;
    if (typeof selectedLayer === 'object' && 'type_' in selectedLayer) return selectedLayer.type_;

    return get().untrackedState.selectedLayer as FrontendOnlyLayerType;
  },
});
