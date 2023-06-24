import { LayerDto, LayerType, PlantingDto, PlantsSummaryDto } from '@/bindings/definitions';
import Konva from 'konva';
import { Node } from 'konva/lib/Node';

import Vector2d = Konva.Vector2d;

/**
 * An action is a change to the map state, initiated by the user.
 * It knows how to apply itself to the map state, how to reverse itself, and how to execute itself.
 * @template T The type of the return value of the execute method.
 * @template U The type of the return value of the execute method for the reversed action.
 */
export type Action<T, U> = {
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
   * A reference to the Konva Transformer.
   * It is used to transform selected objects.
   * The transformer is coupled with the selected objects in the `trackedState`, so it should be here.
   */
  transformer: React.RefObject<Konva.Transformer>;
  /**
   * References to timeouts used by executeActionDebounced.
   *
   * @internal This reference should never be modified by any other function than executeActionDebounced.
   */
  /** Event listener responsible for adding a single shape to the transformer */
  addShapeToTransformer: (shape: Node) => void;
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
   * Redo the last user initiated action.
   */
  redo: () => void;

  /**
   * Apply a remote action to the map state.
   * @param action The action to apply.
   *
   * @internal This method is only used by the EventSource to handle remote actions from other users.
   * It is not meant to be used by the user, on called in event handlers.
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
}

/**
 * The type of the history.
 */
export type History = Array<Action<unknown, unknown>>;

/**
 * Part of store which is unaffected by the History
 */
export interface UntrackedMapSlice {
  untrackedState: UntrackedMapState;
  stageRef: React.RefObject<Konva.Stage>;
  tooltipRef: React.RefObject<Konva.Label>;
  updateSelectedLayer: (selectedLayer: LayerDto) => void;
  updateLayerVisible: (layerName: LayerType, visible: UntrackedLayerState['visible']) => void;
  updateLayerOpacity: (layerName: LayerType, opacity: UntrackedLayerState['opacity']) => void;
  selectPlantForPlanting: (plant: PlantsSummaryDto | null) => void;
  selectPlanting: (planting: PlantingDto | null) => void;
  baseLayerActivateMeasurement: () => void;
  baseLayerDeactivateMeasurement: () => void;
  baseLayerSetMeasurePoint: (point: Vector2d) => void;
}

const LAYER_TYPES = Object.values(LayerType);

export const TRACKED_DEFAULT_STATE: TrackedMapState = {
  layers: LAYER_TYPES.reduce(
    (acc, layerName) => ({
      ...acc,
      [layerName]: {
        index: layerName,
        objects: [],
      },
      [LayerType.Base]: {
        index: LayerType.Base,
        objects: [],
        scale: 100,
        rotation: 0,
        nextcloudImagePath: '',
      },
    }),
    {} as TrackedLayers,
  ),
};

export const UNTRACKED_DEFAULT_STATE: UntrackedMapState = {
  mapId: -1,
  selectedLayer: {
    id: -1,
    is_alternative: false,
    name: 'none',
    type_: LayerType.Base,
    map_id: -1,
  },
  layers: LAYER_TYPES.reduce(
    (acc, layerName) => ({
      ...acc,
      [layerName]: {
        visible: true,
        opacity: 1,
      },
      [LayerType.Base]: {
        visible: true,
        opacity: 1,
        measureStep: 'inactive',
        measurePoint1: null,
        measurePoint2: null,
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
  [key in Exclude<LayerType, LayerType.Plants | LayerType.Base>]: TrackedLayerState;
} & {
  [LayerType.Plants]: TrackedPlantLayerState;
  [LayerType.Base]: TrackedBaseLayerState;
};

export type TrackedPlantLayerState = {
  index: LayerType.Plants;

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
  rotation: number;
  scale: number;
  nextcloudImagePath: string;
};

/**
 * The state of the layers of the map.
 */
export type UntrackedLayers = {
  [key in Exclude<LayerType, LayerType.Plants | LayerType.Base>]: UntrackedLayerState;
} & {
  [LayerType.Plants]: UntrackedPlantLayerState;
  [LayerType.Base]: UntrackedBaseLayerState;
};

export type UntrackedPlantLayerState = UntrackedLayerState & {
  selectedPlantForPlanting: PlantsSummaryDto | null;
  selectedPlanting: PlantingDto | null;
};

export type UntrackedBaseLayerState = UntrackedLayerState & {
  measurePoint1: Vector2d | null;
  measurePoint2: Vector2d | null;
  measureStep: 'inactive' | 'none selected' | 'one selected' | 'both selected';
};

/**
 * The state of the map tracked by the history.
 */
export type TrackedMapState = {
  layers: TrackedLayers;
};

/**
 * The state of the map untracked by the history.
 */
export type UntrackedMapState = {
  mapId: number;
  selectedLayer: LayerDto;
  layers: UntrackedLayers;
};
