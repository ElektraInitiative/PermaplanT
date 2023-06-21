import type {TrackedMapSlice, UntrackedLayers, UntrackedMapSlice, UntrackedMapState,} from './MapStoreTypes';
import {LAYER_NAMES} from './MapStoreTypes';
import {createRef} from 'react';
import {StateCreator} from 'zustand';
import Konva from "konva/cmj";
import Vector2d = Konva.Vector2d;

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
        selectedLayer: selectedLayer,
        layers: {
          ...state.untrackedState.layers,
          Plant: {
            ...state.untrackedState.layers.Plant,
            selectedPlanting: null,
            selectedPlantForPlanting: null,
          },
          Base: {
            ...state.untrackedState.layers.Base,
            measurePoint1: null,
            measurePoint2: null,
            measureStep: "inactive",
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
          Plant: {
            ...state.untrackedState.layers.Plant,
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
          Plant: {
            ...state.untrackedState.layers.Plant,
            selectedPlantForPlanting: null,
            selectedPlanting: planting,
          },
        },
      },
    }));
  },
  /**
   * Allow the user to make measurement inputs on the base layer.
   * Pre-condition: None
   * Post-condition: Base.measureStep is set to "none selected".
   */
  baseLayerActivateMeasurement() {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          Base: {
            ...state.untrackedState.layers.Base,
            measurePoint1: null,
            measurePoint2: null,
            measureStep: "none selected",
          },
        },
      },
    }));
  },
  /**
   * Prevent the user from making measurement inputs on the base layer.
   * Pre-condition: None
   * Post-condition: Base.measureStep is set to "inactive".
   */
  baseLayerDeactivateMeasurement() {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          Base: {
            ...state.untrackedState.layers.Base,
            measurePoint1: null,
            measurePoint2: null,
            measureStep: "inactive",
          },
        },
      },
    }));
  },
  /**
   * Set one measurement point on the base layer.
   * Pre-condition: Base.measureStep has to be either 'none selected' or 'one selected'.
   * Post-condition: Either measurePoint1 or MeasurePoint2 will be set depending on the measurement state.
   */
  baseLayerSetMeasurePoint(point: Vector2d) {
    set((state) => {
      // This function should only be called if one of these two states is active.
      console.assert(state.untrackedState.layers.Base.measureStep === 'none selected'
          || state.untrackedState.layers.Base.measureStep === 'one selected');
      // Measurement step 'one selected' being active implies that measurePoint1 must not be null.
      console.assert(state.untrackedState.layers.Base.measureStep !== 'one selected'
          || state.untrackedState.layers.Base.measurePoint1 !== null);

      const measureStep = state.untrackedState.layers.Base.measureStep;
      const measurePoint1 = state.untrackedState.layers.Base.measurePoint1;
      const measurePoint2 = state.untrackedState.layers.Base.measurePoint2;

      return ({
        ...state,
        untrackedState: {
          ...state.untrackedState,
          layers: {
            ...state.untrackedState.layers,
            Base: {
              ...state.untrackedState.layers.Base,
              measurePoint1: measureStep === "none selected" ? point : measurePoint1,
              measurePoint2: measureStep === "none selected" ? measurePoint2 : point,
              measureStep:   measureStep === "none selected" ? "one selected" : "both selected",
            },
          },
        },
      })
    });
  },
});
