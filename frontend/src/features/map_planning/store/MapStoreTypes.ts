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
 * Utility array of all map layers without any speical attributes.
 */
export const GENERIC_LAYER_NAMES = LAYER_NAMES.filter(name => name === 'Base');

/**
 * A union type of the map layer's names.
 */
export type LayerName = (typeof LAYER_NAMES)[number];

/**
 * A union type of all map layers without any special attributes.
 */
export type GenericLayerName = (typeof GENERIC_LAYER_NAMES)[number];

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
 * The state of every map layer.
 */
export type TrackedGenericLayerState = {
  index: LayerName;
  /**
   * The state of the objects on the layer.
   */
  objects: ObjectState[];
};


/**
 * Extended state type for base layer.
 * Adds a background image as well as its attributes.
 */
export type TrackedBaseLayerState = TrackedGenericLayerState & {
  /**
   * Rotation of the background image.
   */
  rotation: number;
  /**
   * Scale of the background image.
   */
  scale: number;
  /**
   * Temporary, will be removed after base layer is integrated with Nextcloud.
   */
  imageURL: string,
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
  [key in GenericLayerName]: TrackedGenericLayerState;
} & {
  Base: TrackedBaseLayerState,
};

/**
 * The state of the layers of the map.
 */
export type UntrackedLayers = {
  [key in GenericLayerName]: UntrackedLayerState;
} & {
  Base: UntrackedLayerState,
};

/**
 * The state of the map tracked by the history.
 */
export type TrackedMapState = {
  layers: TrackedLayers;
};

/**
 *
 */
export type MeasurementState = {
  /**
   * If any step besides inactive is set, all controls on the map will be disabled.
   *
   * Inactive:          No measurement is currently being made, display the map normally.
   * NoPointSelected:   The user has to click on the map to select the first point for measurement.
   * OnePointSelected:  A line is drawn continually from the first point to the location of the users mouse.
   * TwoPointsSelected: The second point of the line is fixed.
   *                    This state will remain active until the system is manually reset to inactive.
   */
  step: 'Inactive' | 'NoPointSelected' | 'OnePointSelected' | 'TwoPointsSelected';
  /**
   * The distance resulting from the last measurement.
   */
  lastDistance: number,
  /**
   * Is set when the user clicks in step NoPointSelected.
   */
  firstPoint:  [number, number],
  /**
   * Is set if the user clicks in step OnePointSelected.
   */
  secondPoint: [number, number],
  /**
   * Will be called once the measurement has completed.
   * @param distance the measured distance.
   */
  callback: (distance: number) => void;
}

/**
 * The state of the map untracked by the history.
 */
export type UntrackedMapState = {
  selectedLayer: LayerName;
  layers: UntrackedLayers;
  measurement: MeasurementState;
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

export type BaseLayerUpdateAction = {
  type: 'BASE_LAYER_UPDATE_ACTION';
  payload: {
    rotation: number;
    scale: number;
    imageURL: string;
  };
}

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
  | BaseLayerUpdateAction
  | UndoAction
  | RedoAction;

/**
 * A union type for all actions that are tracked in the history.
 */
export type TrackedAction = Exclude<MapAction, UndoAction | RedoAction>;
