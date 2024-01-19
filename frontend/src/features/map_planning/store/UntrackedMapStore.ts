import Konva from 'konva';
import { Vector2d } from 'konva/lib/types';
import { createRef } from 'react';
import { StateCreator } from 'zustand';
import { LayerType, Shade, ShadingDto } from '@/api_types/definitions';
import { FrontendOnlyLayerType } from '@/features/map_planning/layers/_frontend_only';
import { SelectionRectAttrs } from '../types/SelectionRectAttrs';
import { convertToDate } from '../utils/date-utils';
import { filterVisibleObjects } from '../utils/filterVisibleObjects';
import {
  ViewRect,
  TrackedMapSlice,
  UNTRACKED_DEFAULT_STATE,
  UntrackedMapSlice,
} from './MapStoreTypes';
import { clearInvalidSelection, typeOfLayer } from './utils';

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
    get().transformer.current?.nodes([]);
    get().baseLayerDeactivatePolygonManipulation();
    get().shadeLayerDeactivatePolygonManipulation();
    get().clearStatusPanelContent();

    if (typeOfLayer(selectedLayer) === LayerType.Shade) {
      get().transformer.current?.rotateEnabled(false);
      get().transformer.current?.resizeEnabled(false);
    } else {
      get().transformer.current?.rotateEnabled(true);
      get().transformer.current?.resizeEnabled(true);
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
            selectedPlantings: null,
            selectedPlantForPlanting: null,
          },
          base: {
            ...state.untrackedState.layers.base,
            measurePoint1: null,
            measurePoint2: null,
            measureStep: 'inactive',
          },
          shade: {
            ...state.untrackedState.layers.shade,
            selectedShadeForNewShading: null,
            selectedShadings: null,
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
  selectPlantings(plantings) {
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

    const shadingsVisibleRelativeToTimelineDate = filterVisibleObjects(
      get().trackedState.layers.shade.loadedObjects,
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
          shade: {
            ...state.trackedState.layers.shade,
            objects: shadingsVisibleRelativeToTimelineDate,
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
    get().transformer.current?.rotateEnabled(false);
    get().transformer.current?.resizeEnabled(false);
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
    get().transformer.current?.rotateEnabled(false);
    get().transformer.current?.resizeEnabled(false);
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
    get().transformer.current?.rotateEnabled(true);
    get().transformer.current?.resizeEnabled(true);
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
  shadeLayerSelectShadings(shadings: ShadingDto[] | null) {
    if (shadings === null) {
      get().setInhibitTransformer(false);
      get().shadeLayerDeactivatePolygonManipulation();
      get().clearStatusPanelContent();
    }

    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          shade: {
            ...state.untrackedState.layers.shade,
            selectedShadings: shadings,
          },
        },
      },
    }));
  },
  shadeLayerActivateAddPolygonPoints() {
    get().shadeLayerSelectShadeForNewShading(null);
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          shade: {
            ...state.untrackedState.layers.shade,
            selectedShadingEditMode: 'add',
          },
        },
      },
    }));
  },
  shadeLayerActivateDeletePolygonPoints() {
    get().shadeLayerSelectShadeForNewShading(null);
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          shade: {
            ...state.untrackedState.layers.shade,
            selectedShadingEditMode: 'remove',
          },
        },
      },
    }));
  },
  shadeLayerActivateMovePolygonPoints() {
    get().shadeLayerSelectShadeForNewShading(null);
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          shade: {
            ...state.untrackedState.layers.shade,
            selectedShadingEditMode: 'move',
          },
        },
      },
    }));
  },
  shadeLayerDeactivatePolygonManipulation() {
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          shade: {
            ...state.untrackedState.layers.shade,
            selectedShadingEditMode: 'inactive',
          },
        },
      },
    }));
  },
  shadeLayerSelectShadeForNewShading(shade: Shade | null) {
    if (shade !== null) {
      get().shadeLayerDeactivatePolygonManipulation();
      get().shadeLayerSelectShadings(null);
    }
    set((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        layers: {
          ...state.untrackedState.layers,
          shade: {
            ...state.untrackedState.layers.shade,
            selectedShadeForNewShading: shade,
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
