import Konva from 'konva';
import { Shape, ShapeConfig } from 'konva/lib/Shape';

/**
 * Part of store which is affected by the History
 */
export interface TrackedMapSlice {
  trackedState: TrackedMapState;
  step: number;
  history: TrackedAction[];
  canUndo: boolean;
  canRedo: boolean;
  /**
   * The transformer is a reference to the Konva Transformer.
   * It is used to transform selected objects.
   * The transformer is coupled with the selected objects in the trackedState, so it should be here.
   */
  transformer: React.RefObject<Konva.Transformer>;
  dispatch: (action: MapAction) => void;
  /** Event listener responsible for adding a single shape to the transformer */
  addShapeToTransformer: (shape: Shape<ShapeConfig>) => void;
}

/**
 * Part of store which is unaffected by the History
 */
export interface UntrackedMapSlice {
  untrackedState: UntrackedMapState;
  updateSelectedLayer: (selectedLayer: LayerName) => void;
  updateLayerVisible: (layerName: LayerName, visible: UntrackedLayerState['visible']) => void;
  updateLayerOpacity: (layerName: LayerName, opacity: UntrackedLayerState['opacity']) => void;
}

/**
 * Utility array of the map layer's names.
 */
export const LAYER_NAMES = [
  'Base',
  'Plant',
  'Drawing',
  'Dimension',
  'Fertilization',
  'Habitats',
  'Hydrology',
  'Infrastructure',
  'Labels',
  'Landscape',
  'Paths',
  'Shade',
  'Soil',
  'Terrain',
  'Trees',
  'Warnings',
  'Winds',
  'Zones',
] as const;

/**
 * A union type of the map layer's names.
 */
export type LayerName = (typeof LAYER_NAMES)[number];

/**
 * The state of a layer's object.
 */
export type ObjectState = {
  index: LayerName;
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
  index: LayerName;
  /**
   * The state of the objects on the layer.
   */
  objects: ObjectState[];
};

/**
 * The state of a map's layer.
 */
export type UntrackedLayerState = {
  index: LayerName;
  visible: boolean;
  opacity: number;
};

/**
 * The state of the layers of the map.
 */
export type TrackedLayers = {
  [key in LayerName]: TrackedLayerState;
};

/**
 * The state of the layers of the map.
 */
export type UntrackedLayers = {
  [key in LayerName]: UntrackedLayerState;
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
  selectedLayer: LayerName;
  layers: UntrackedLayers;
};

/**
 * An action for adding an object to the map.
 */
export type ObjectAddAction = {
  type: 'OBJECT_ADD';
  payload: ObjectState;
};

/**
 * An action for updating an object on the map.
 */
export type ObjectUpdatePositionAction = {
  type: 'OBJECT_UPDATE_POSITION';
  payload: ObjectState[];
};

/**
 * An action for updating an object on the map.
 */
export type ObjectUpdateTransformAction = {
  type: 'OBJECT_UPDATE_TRANSFORM';
  payload: ObjectState[];
};

/**
 * An action for undoing the previous action in the history.
 */
export type UndoAction = {
  type: 'UNDO';
};

/**
 * An action for redoing the next action in the history.
 */
export type RedoAction = {
  type: 'REDO';
};

/**
 * A union type for all actions.
 */
export type MapAction =
  | ObjectAddAction
  | ObjectUpdatePositionAction
  | ObjectUpdateTransformAction
  | UndoAction
  | RedoAction;

/**
 * A union type for all actions that are tracked in the history.
 */
export type TrackedAction = Exclude<MapAction, UndoAction | RedoAction>;
