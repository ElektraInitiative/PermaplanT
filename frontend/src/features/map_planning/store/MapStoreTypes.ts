import Konva from 'konva';
import * as uuid from 'uuid';
import { StateCreator } from 'zustand';
import {
  BaseLayerImageDto,
  DrawingDto,
  LayerDto,
  LayerType,
  PlantingDto,
  PlantsSummaryDto,
  SeedDto,
} from '@/api_types/definitions';
import { FrontendOnlyLayerType } from '@/features/map_planning/layers/_frontend_only';
import { PolygonGeometry } from '@/features/map_planning/types/PolygonTypes';
import { DrawingShapeType } from '../layers/drawing/types';
import { convertToDateString } from '../utils/date-utils';
import { TransformerStore } from './transformer/TransformerStore';

import Vector2d = Konva.Vector2d;

export type MapCreator = StateCreator<TrackedMapSlice & UntrackedMapSlice, [], []>;
export type SetFn = Parameters<MapCreator>[0];
export type GetFn = Parameters<MapCreator>[1];

/**
 * This type combines layers that are only available in the frontend
 * with layers that are also reflected in the backend.
 */
export type CombinedLayerType = LayerType | FrontendOnlyLayerType;

/**
 * An action is a change to the map state, initiated by the user.
 * It knows how to apply itself to the map state, how to reverse itself, and how to execute itself.
 * @template T The type of the return value of the execute method.
 * @template U The type of the return value of the execute method for the reversed action.
 */
export type Action<T, U> = {
  /**
   * Id of the action so that RemoteActions can be filtered out.
   */
  actionId: string;

  /**
   * Entity ids that are affected by this action.
   */
  entityIds: string[];

  /**
   * Get the reverse action for this action.
   * The reverse action is populated with the current state of the object on the map.
   * This method should be called before `apply` has been called, if tracking the action in the history is desired.
   * @param state The current state of the map.
   * @returns The reverse action or null if the action cannot be reversed.
   */
  reverse(state: TrackedMapState): Action<U, T> | null;

  /**
   * Apply the action to the map state.
   * This method should only be called after `reverse` has been called, if tracking the action in the history is desired.
   * @param state The current state of the map.
   */
  apply(state: TrackedMapState): TrackedMapState;

  /**
   * Execute the action by informing the backend.
   */
  execute(mapId: number): Promise<T>;
};

/**
 * Type to keep track of the last actions of a user.
 */
type LastAction = {
  actionId: string;
  entityId: string;
};

/**
 * This part of the state contains the layers of the map and the objects on them.
 * User initiated changes to this part of the state are tracked in the history.
 * The history is used to undo and redo actions.
 */
export interface TrackedMapSlice {
  /**
   * The state of the map layers and objects.
   */
  trackedState: TrackedMapState;
  /**
   * An index pointing into the history.
   */
  step: number;
  /**
   * Contains a history of user initiated actions.
   */
  history: History;
  canUndo: boolean;
  canRedo: boolean;
  /**
   * Execute a user initiated action.
   * @param action the action to be executed
   */
  executeAction: <T, U>(action: Action<T, U>) => void;
  /**
   * Undo the last user initiated action.
   */
  undo: () => void;
  /**
   * Redo the last user initiaPplated action.
   */
  redo: () => void;

  /**
   * Apply a remote action to the map state.
   * @param action The action to apply.
   *
   * @internal This method is only used by the EventSource to handle remote actions from other users.
   * It is not meant to be used in other places, or called from event handlers.
   */
  __applyRemoteAction: (action: Action<unknown, unknown>) => void;
  /**
   * Only called as part of the map initialization, do not call anywhere else.
   * Resets store to default values before fetching new data, to avoid temporarily displaying wrong map data.
   */
  __resetStore: () => void;
  /**
   * Initializes the plant layer.
   */
  initPlantLayer: (plantLayer: PlantingDto[]) => void;
  /**
   * Initializes the base layer.
   */
  initBaseLayer: (baseLayer: BaseLayerImageDto) => void;

  /**
   * Initializes the drawing layer.
   */
  initDrawingLayer: (drawingLayer: DrawingDto[]) => void;

  initLayerId: (layer: LayerType, layerId: number) => void;
}

/**
 * The type of the history.
 */
export type History = Array<Action<unknown, unknown>>;

type SelectionRectAttributes = {
  x: number;
  y: number;
  width: number;
  height: number;
  isVisible: boolean;
  boundingBox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
};

/**
 * Part of store which is unaffected by the History
 */
export interface UntrackedMapSlice {
  untrackedState: UntrackedMapState;
  stageRef: React.RefObject<Konva.Stage>;
  tooltipRef: React.RefObject<Konva.Label>;
  selectionRectAttributes: SelectionRectAttributes;
  updateSelectionRect: (update: React.SetStateAction<SelectionRectAttributes>) => void;
  updateViewRect: (bounds: ViewRect) => void;
  // The backend does not know about frontend only layers, hence they are not part of LayerDto.
  updateSelectedLayer: (selectedLayer: LayerDto | FrontendOnlyLayerType) => void;
  updateLayerVisible: (
    layerName: CombinedLayerType,
    visible: UntrackedLayerState['visible'],
  ) => void;
  updateLayerOpacity: (
    layerName: CombinedLayerType,
    opacity: UntrackedLayerState['opacity'],
  ) => void;
  lastActions: LastAction[];
  selectPlantForPlanting: (plant: PlantForPlanting | null) => void;
  selectPlantings: (plantings: PlantingDto[] | null, transformerStore?: TransformerStore) => void;
  toggleShowPlantLabel: () => void;
  baseLayerActivateMeasurement: () => void;
  baseLayerDeactivateMeasurement: () => void;
  baseLayerSetMeasurePoint: (point: Vector2d) => void;
  baseLayerActivateAddPolygonPoints: () => void;
  baseLayerActivateMovePolygonPoints: () => void;
  baseLayerActivateDeletePolygonPoints: () => void;
  baseLayerDeactivatePolygonManipulation: () => void;

  drawingLayerActivateDrawingMode: (shape: DrawingShapeType) => void;
  drawingLayerClearSelectedShape: () => void;
  drawingLayerSetSelectedColor: (color: string) => void;
  drawingLayerSetFillEnabled: (fill: boolean) => void;
  drawingLayerSetSelectedStrokeWidth: (strokeWidth: number) => void;
  drawingLayerSetEditMode: (drawingId?: string, editMode?: DrawingLayerEditMode) => void;
  selectDrawings: (drawings: DrawingDto[] | null, transformerStore?: TransformerStore) => void;

  disableShapeSelection: () => void;
  enableShapeSelection: () => void;

  updateTimelineDate: (date: string) => void;
  setTimelineBounds: (from: string, to: string) => void;
  getSelectedLayerType: () => CombinedLayerType;
  getSelectedLayerId: () => number | null;
  setTooltipText: (content: string) => void;
  setTooltipPosition: (position: { x: number; y: number }) => void;
  setStatusPanelContent: (content: React.ReactElement) => void;
  clearStatusPanelContent: () => void;

  /**
   * Only used by the EventSource to remove actions from the list of last actions.
   * Removes the last action from the list of last actions.
   */
  __removeLastAction: (lastAction: LastAction) => void;
}

const LAYER_TYPES = Object.values(LayerType);
const FRONTEND_ONLY_LAYER_TYPES = Object.values(FrontendOnlyLayerType);
const COMBINED_LAYER_TYPES = [...LAYER_TYPES, ...FRONTEND_ONLY_LAYER_TYPES];

export const TRACKED_DEFAULT_STATE: TrackedMapState = {
  layers: LAYER_TYPES.reduce(
    (acc, layerName) => ({
      ...acc,
      [layerName]: {
        id: -1,
        index: layerName,
        objects: [],
      },
      [LayerType.Base]: {
        layerId: 0,
        id: -1,
        index: LayerType.Base,
        imageId: uuid.v4(),
        scale: 100,
        rotation: 0,
        nextcloudImagePath: '',
      },
      [LayerType.Plants]: {
        id: -1,
        index: LayerType.Plants,
        objects: [],
        loadedObjects: [],
      },
      [LayerType.Drawing]: {
        layerId: 0,
        id: -1,
        index: LayerType.Drawing,
        objects: [],
        loadedObjects: [],
      },
    }),
    {} as TrackedLayers,
  ),
  mapGeometry: { srid: '', rings: [] },
};

export const UNTRACKED_DEFAULT_STATE: UntrackedMapState = {
  mapId: -1,
  editorViewRect: { x: 0, y: 0, width: 0, height: 0 },
  timelineDate: convertToDateString(new Date()),
  fetchDate: convertToDateString(new Date()),
  timelineBounds: {
    from: convertToDateString(new Date()),
    to: convertToDateString(new Date()),
  },
  selectedLayer: {
    id: -1,
    is_alternative: false,
    name: 'none',
    type_: LayerType.Base,
    map_id: -1,
  },
  tooltipContent: '',
  tooltipPosition: { x: 0, y: 0 },
  bottomStatusPanelContent: null,
  shapeSelectionEnabled: true,
  layers: COMBINED_LAYER_TYPES.reduce(
    (acc, layerName) => ({
      ...acc,
      [layerName]: {
        visible: true,
        opacity: 1,
      },
      [LayerType.Plants]: {
        visible: true,
        opacity: 1,
        showLabels: true,
      } as UntrackedPlantLayerState,
      [LayerType.Drawing]: {
        index: LayerType.Drawing,
        visible: true,
        opacity: 1,
        shape: null,
        selectedColor: 'black',
        fillEnabled: false,
        selectedStrokeWidth: 3,
        selectedDrawings: [],
        editMode: undefined,
        editDrawingId: undefined,
      } as UntrackedDrawingLayerState,
      [LayerType.Base]: {
        visible: true,
        opacity: 1,
        autoScale: {
          measureStep: 'inactive',
          measurePoint1: null,
          measurePoint2: null,
        },
        mapGeometry: {
          editMode: 'inactive',
        },
      } as UntrackedBaseLayerState,
    }),
    {} as UntrackedLayers,
  ),
};

/**
 * The state of a layer's object.
 */
export type ObjectState = {
  index: LayerType;
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
};

/**
 * The state of a map's layer.
 */
export type TrackedLayerState = {
  index: LayerType;
  id: number;
  /**
   * The state of the objects on the layer.
   */
  objects: ObjectState[];
};

/**
 * The state of a map's layer.
 */
export type UntrackedLayerState = {
  index: LayerType;
  visible: boolean;
  opacity: number;
};

/**
 * The state of the layers of the map.
 */
export type TrackedLayers = {
  [key in Exclude<
    LayerType,
    LayerType.Plants | LayerType.Base | LayerType.Drawing
  >]: TrackedLayerState;
} & {
  [LayerType.Plants]: TrackedPlantLayerState;
  [LayerType.Base]: TrackedBaseLayerState;
  [LayerType.Drawing]: TrackedDrawingLayerState;
};

export type TrackedPlantLayerState = {
  index: LayerType.Plants;
  id: number;

  /**
   * The objects visible relative to the current selected date.
   * This is a subset of `loadedObjects`.
   */
  objects: PlantingDto[];
  /**
   * The objects that have been loaded from the backend.
   */
  loadedObjects: PlantingDto[];
};

export type TrackedBaseLayerState = {
  id: number;
  layerId: number;
  imageId: string;
  rotation: number;
  scale: number;
  nextcloudImagePath: string;
};

export type TrackedDrawingLayerState = {
  id: number;
  layerId: number;
  objects: DrawingDto[];
  loadedObjects: DrawingDto[];
};

/**
 * The state of the layers of the map.
 */
export type UntrackedLayers = {
  [key in Exclude<
    CombinedLayerType,
    LayerType.Plants | LayerType.Base | LayerType.Drawing
  >]: UntrackedLayerState;
} & {
  [LayerType.Plants]: UntrackedPlantLayerState;
  [LayerType.Base]: UntrackedBaseLayerState;
  [LayerType.Drawing]: UntrackedDrawingLayerState;
};

export type UntrackedPlantLayerState = UntrackedLayerState & {
  selectedPlantForPlanting: PlantForPlanting | null;
  selectedPlantings: PlantingDto[] | null;
  showLabels: boolean;
};

export type UntrackedDrawingLayerState = UntrackedLayerState & {
  shape: DrawingShapeType | null;
  selectedDrawings: DrawingDto[] | null;
  selectedColor: string;
  fillEnabled: boolean;
  selectedStrokeWidth: number;
  editMode: DrawingLayerEditMode;
  editDrawingId?: string;
};

export type UntrackedBaseLayerState = UntrackedLayerState & {
  autoScale: {
    measurePoint1: Vector2d | null;
    measurePoint2: Vector2d | null;
    measureStep: 'inactive' | 'none selected' | 'one selected' | 'both selected';
  };
  mapGeometry: {
    editMode: 'inactive' | 'add' | 'remove' | 'move';
  };
};

/**
 * Contains information necessary for creating a new planting on the map.
 */
export type PlantForPlanting = {
  plant: PlantsSummaryDto;
  seed: SeedDto | null;
};

export type DrawingLayerEditMode = 'draw' | 'add' | 'remove' | undefined;

/**
 * The state of the map tracked by the history.
 */
export type TrackedMapState = {
  layers: TrackedLayers;
  mapGeometry: PolygonGeometry;
};

/**
 * The state of the map untracked by the history.
 */
export type UntrackedMapState = {
  mapId: number;
  editorViewRect: ViewRect;
  // The backend does not know about frontend only layers, hence they are not part of LayerDto.
  selectedLayer: LayerDto | FrontendOnlyLayerType;
  /** used for the bounds calculation */
  timelineDate: string;
  /** used for fetching */
  fetchDate: string;
  timelineBounds: {
    from: string;
    to: string;
  };
  shapeSelectionEnabled: boolean;
  /** Storing the current content prevents constant rerenders of the tooltip component.  */
  tooltipContent: string;
  tooltipPosition: { x: number; y: number };
  bottomStatusPanelContent: React.ReactNode | null;
  layers: UntrackedLayers;
};

/**
 * Represents a simple rectangle with width, height and position.
 */
export type ViewRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
