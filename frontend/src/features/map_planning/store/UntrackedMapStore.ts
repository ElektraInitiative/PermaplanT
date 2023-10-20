import { convertToDate } from '../utils/date-utils';
import { filterVisibleObjects } from '../utils/filterVisibleObjects';
import {
  BoundsRect,
  TrackedMapSlice,
  UNTRACKED_DEFAULT_STATE,
  UntrackedMapSlice,
} from './MapStoreTypes';
import { clearInvalidSelection } from './utils';
import { FrontendOnlyLayerType } from '@/features/map_planning/layers/_frontend_only';
import Konva from 'konva';
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
  updateMapBounds(bounds: BoundsRect) {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        editorBounds: bounds,
      },
    }));
  },
  lastActions: [],
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
          base: {
            ...state.untrackedState.layers.base,
            measurePoint1: null,
            measurePoint2: null,
            measureStep: 'inactive',
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
  toggleShowPlantLabel() {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          plants: {
            ...state.untrackedState.layers.plants,
            showLabels: !state.untrackedState.layers.plants.showLabels,
          },
        },
      },
    }));
  },
  setTimelineBounds(from: string, to: string) {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        timelineBounds: {
          from: from,
          to: to,
        },
      },
    }));
  },
  async updateTimelineDate(date) {
    const bounds = get().untrackedState.timelineBounds;
    const from = convertToDate(bounds.from);
    const to = convertToDate(bounds.to);
    const dateAsDate = convertToDate(date);

    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        timelineDate: date,
      },
    }));

    if (dateAsDate < from || dateAsDate > to) {
      set((state) => ({
        ...state,
        untrackedState: {
          ...state.untrackedState,
          fetchDate: date,
        },
      }));

      clearInvalidSelection(get);
      return;
    }

    const plantsVisibleRelativeToTimelineDate = filterVisibleObjects(
      get().trackedState.layers.plants.loadedObjects,
      date,
    );

    set((state) => ({
      ...state,
      trackedState: {
        ...state.trackedState,
        layers: {
          ...state.trackedState.layers,
          plants: {
            ...state.trackedState.layers.plants,
            objects: plantsVisibleRelativeToTimelineDate,
          },
        },
      },
    }));
    clearInvalidSelection(get);
  },
  setTooltipText(content) {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        tooltipContent: content,
      },
    }));
  },
  setTooltipPosition(position) {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        tooltipPosition: position,
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
  getSelectedLayerType() {
    const selectedLayer = get().untrackedState.selectedLayer;
    if (typeof selectedLayer === 'object' && 'type_' in selectedLayer) return selectedLayer.type_;

    return get().untrackedState.selectedLayer as FrontendOnlyLayerType;
  },
  getSelectedLayerId() {
    const selectedLayer = get().untrackedState.selectedLayer;
    if (typeof selectedLayer === 'object' && 'id' in selectedLayer) return selectedLayer.id;

    return null;
  },
  __removeLastAction({ actionId, entityId }) {
    console.log('Removing action', actionId, entityId);

    set((state) => ({
      ...state,
      lastActions: state.lastActions.filter(
        (a) => !(a.actionId === actionId && a.entityId === entityId),
      ),
    }));
  },
});
