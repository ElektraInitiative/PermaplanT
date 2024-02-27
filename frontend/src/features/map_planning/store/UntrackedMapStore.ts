import Konva from 'konva';
import { Vector2d } from 'konva/lib/types';
import { createRef } from 'react';
import { StateCreator } from 'zustand';
import { FrontendOnlyLayerType } from '@/features/map_planning/layers/_frontend_only';
import { SelectionRectAttrs } from '../types/SelectionRectAttrs';
import { convertToDate } from '../utils/date-utils';
import { filterVisibleObjects } from '../utils/filterVisibleObjects';
import { isOneAreaOfPlanting } from '../utils/planting-utils';
import {
  ViewRect,
  TrackedMapSlice,
  UNTRACKED_DEFAULT_STATE,
  UntrackedMapSlice,
} from './MapStoreTypes';
import { TransformerStore, useTransformerStore } from './transformer/TransformerStore';
import { clearInvalidSelection } from './utils';

export const createUntrackedMapSlice: StateCreator<
  TrackedMapSlice & UntrackedMapSlice,
  [],
  [],
  UntrackedMapSlice
> = (set, get) => ({
  untrackedState: UNTRACKED_DEFAULT_STATE,
  stageRef: createRef<Konva.Stage>(),
  tooltipRef: createRef(),
  selectionRectAttributes: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isVisible: false,
    boundingBox: {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    },
  },
  updateSelectionRect(update: React.SetStateAction<SelectionRectAttrs>) {
    if (typeof update === 'function') {
      set((state) => ({
        ...state,
        selectionRectAttributes: update(state.selectionRectAttributes),
      }));
    } else {
      set((state) => ({
        ...state,
        selectionRectAttributes: {
          ...state.selectionRectAttributes,
          ...update,
        },
      }));
    }
  },
  updateViewRect(bounds: ViewRect) {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        editorViewRect: bounds,
      },
    }));
  },
  lastActions: [],
  updateSelectedLayer(selectedLayer) {
    // Clear the transformer's nodes.
    useTransformerStore.getState().actions.clearSelection();
    get().baseLayerDeactivatePolygonManipulation();
    get().clearStatusPanelContent();

    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        selectedLayer: selectedLayer,
        layers: {
          ...state.untrackedState.layers,
          plants: {
            ...state.untrackedState.layers.plants,
            selectedPlantings: null,
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
            selectedPlantings: null,
            selectedPlantForPlanting: plant,
          },
        },
      },
    }));
  },
  selectPlantings(plantings, transformerStore?: TransformerStore) {
    if (transformerStore) {
      if (isOneAreaOfPlanting(plantings)) {
        transformerStore.actions.enableAllAnchors();
      } else {
        transformerStore.actions.enableDefaultAnchors();
      }
    }

    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          plants: {
            ...state.untrackedState.layers.plants,
            selectedPlantForPlanting: null,
            selectedPlantings: plantings,
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

    const drawingsVisibleRelativeToTimelineDate = filterVisibleObjects(
      get().trackedState.layers.drawing.loadedObjects,
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
          drawing: {
            ...state.trackedState.layers.drawing,
            objects: drawingsVisibleRelativeToTimelineDate,
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
    get().baseLayerDeactivatePolygonManipulation();
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          base: {
            ...state.untrackedState.layers.base,
            autoScale: {
              measurePoint1: null,
              measurePoint2: null,
              measureStep: 'none selected',
            },
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
            autoScale: {
              measurePoint1: null,
              measurePoint2: null,
              measureStep: 'inactive',
            },
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
        state.untrackedState.layers.base.autoScale.measureStep !== 'none selected' &&
        state.untrackedState.layers.base.autoScale.measureStep !== 'one selected'
      )
        return state;

      // Measurement step 'one selected' being active implies that measurePoint1 must not be null.
      const measureStep = state.untrackedState.layers.base.autoScale.measureStep;
      const measurePoint1 = state.untrackedState.layers.base.autoScale.measurePoint1;
      const measurePoint2 = state.untrackedState.layers.base.autoScale.measurePoint2;

      return {
        ...state,
        untrackedState: {
          ...state.untrackedState,
          layers: {
            ...state.untrackedState.layers,
            base: {
              ...state.untrackedState.layers.base,
              autoScale: {
                measurePoint1: measureStep === 'none selected' ? point : measurePoint1,
                measurePoint2: measureStep === 'none selected' ? measurePoint2 : point,
                measureStep: measureStep === 'none selected' ? 'one selected' : 'both selected',
              },
            },
          },
        },
      };
    });
  },
  baseLayerActivateAddPolygonPoints() {
    get().baseLayerDeactivateMeasurement();
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          base: {
            ...state.untrackedState.layers.base,
            mapGeometry: {
              ...state.untrackedState.layers.base.mapGeometry,
              editMode: 'add',
            },
          },
        },
      },
    }));
  },
  baseLayerActivateDeletePolygonPoints() {
    get().baseLayerDeactivateMeasurement();
    useTransformerStore.getState().actions.enableRotation(false);
    useTransformerStore.getState().actions.enableResizing(false);
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          base: {
            ...state.untrackedState.layers.base,
            mapGeometry: {
              ...state.untrackedState.layers.base.mapGeometry,
              editMode: 'remove',
            },
          },
        },
      },
    }));
  },
  baseLayerActivateMovePolygonPoints() {
    get().baseLayerDeactivateMeasurement();
    useTransformerStore.getState().actions.enableRotation(false);
    useTransformerStore.getState().actions.enableResizing(false);
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          base: {
            ...state.untrackedState.layers.base,
            mapGeometry: {
              ...state.untrackedState.layers.base.mapGeometry,
              editMode: 'move',
            },
          },
        },
      },
    }));
  },
  baseLayerDeactivatePolygonManipulation() {
    useTransformerStore.getState().actions.enableRotation(true);
    useTransformerStore.getState().actions.enableResizing(true);
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          base: {
            ...state.untrackedState.layers.base,
            mapGeometry: {
              ...state.untrackedState.layers.base.mapGeometry,
              editMode: 'inactive',
            },
          },
        },
      },
    }));
  },

  disableShapeSelection() {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        shapeSelectionEnabled: false,
      },
    }));
  },

  enableShapeSelection() {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        shapeSelectionEnabled: true,
      },
    }));
  },

  drawingLayerSetSelectedColor(color) {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          drawing: {
            ...state.untrackedState.layers.drawing,
            selectedColor: color,
          },
        },
      },
    }));
  },

  drawingLayerSetFillEnabled(fill: boolean) {
    get().disableShapeSelection();
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          drawing: {
            ...state.untrackedState.layers.drawing,
            fillEnabled: fill,
          },
        },
      },
    }));
  },

  drawingLayerSetSelectedStrokeWidth(strokeWidth) {
    get().disableShapeSelection();
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          drawing: {
            ...state.untrackedState.layers.drawing,
            selectedStrokeWidth: strokeWidth,
          },
        },
      },
    }));
  },

  drawingLayerActivateDrawingMode(shape) {
    get().drawingLayerClearSelectedShape();
    get().disableShapeSelection();
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          drawing: {
            ...state.untrackedState.layers.drawing,
            shape: shape,
            selectedDrawings: null,
          },
        },
      },
    }));
  },

  drawingLayerSetActiveShape(id: string) {
    get().disableShapeSelection();
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          drawing: {
            ...state.untrackedState.layers.drawing,
            activeShape: id,
          },
        },
      },
    }));
  },

  drawingLayerClearSelectedShape() {
    get().enableShapeSelection();
    get().clearStatusPanelContent();
    get().disableShapeSelection();
    useTransformerStore.getState().actions.clearSelection();
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          drawing: {
            ...state.untrackedState.layers.drawing,
            shape: null,
            activeShape: undefined,
          },
        },
      },
    }));
  },
  selectDrawings(drawings, transformerStore?: TransformerStore) {
    if (transformerStore) {
      transformerStore.actions.enableAllAnchors();
    }

    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          drawing: {
            ...state.untrackedState.layers.drawing,
            selectedDrawings: drawings,
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
  getSelectedLayerId() {
    const selectedLayer = get().untrackedState.selectedLayer;
    if (typeof selectedLayer === 'object' && 'id' in selectedLayer) return selectedLayer.id;

    return null;
  },
  setStatusPanelContent(content: React.ReactNode) {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        bottomStatusPanelContent: content,
      },
    }));
  },
  clearStatusPanelContent() {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        bottomStatusPanelContent: null,
      },
    }));
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
