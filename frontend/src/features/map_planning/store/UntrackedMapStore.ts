import { TrackedMapSlice, UNTRACKED_DEFAULT_STATE, UntrackedMapSlice } from './MapStoreTypes';
import { Vector2d } from 'konva/lib/types';
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
          base: {
            ...state.untrackedState.layers.base,
            measurePoint1: null,
            measurePoint2: null,
            measureStep: 'inactive',
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
  /**
   * Allow the user to make measurement inputs on the base layer.
   */
  baseLayerActivateMeasurement() {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          base: {
            ...state.untrackedState.layers.base,
            measurePoint1: null,
            measurePoint2: null,
            measureStep: 'none selected',
          },
        },
      },
    }));
  },
  /**
   * Prevent the user from making measurement inputs on the base layer.
   */
  baseLayerDeactivateMeasurement() {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          base: {
            ...state.untrackedState.layers.base,
            measurePoint1: null,
            measurePoint2: null,
            measureStep: 'inactive',
          },
        },
      },
    }));
  },
  /**
   * Set one measurement point on the base layer.
   */
  baseLayerSetMeasurePoint(point: Vector2d) {
    set((state) => {
      // This function should only be called if one of these two states is active.
      if (
        state.untrackedState.layers.base.measureStep !== 'none selected' &&
        state.untrackedState.layers.base.measureStep !== 'one selected'
      )
        return state;

      // Measurement step 'one selected' being active implies that measurePoint1 must not be null.
      console.assert(
        state.untrackedState.layers.base.measureStep !== 'one selected' ||
          state.untrackedState.layers.base.measurePoint1 !== null,
      );

      const measureStep = state.untrackedState.layers.base.measureStep;
      const measurePoint1 = state.untrackedState.layers.base.measurePoint1;
      const measurePoint2 = state.untrackedState.layers.base.measurePoint2;

      return {
        ...state,
        untrackedState: {
          ...state.untrackedState,
          layers: {
            ...state.untrackedState.layers,
            base: {
              ...state.untrackedState.layers.base,
              measurePoint1: measureStep === 'none selected' ? point : measurePoint1,
              measurePoint2: measureStep === 'none selected' ? measurePoint2 : point,
              measureStep: measureStep === 'none selected' ? 'one selected' : 'both selected',
            },
          },
        },
      };
    });
  },
});
