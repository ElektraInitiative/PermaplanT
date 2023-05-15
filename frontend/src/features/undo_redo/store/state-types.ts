/**
 * A union type of the map layer's names.
 */
export type LayerName =
  | 'Base'
  | 'Plant'
  | 'Drawing'
  | 'Dimension'
  | 'Fertilization'
  | 'Habitats'
  | 'Hydrology'
  | 'Infrastructure'
  | 'Labels'
  | 'Landscape'
  | 'Paths'
  | 'Shade'
  | 'Soil'
  | 'Terrain'
  | 'Trees'
  | 'Warnings'
  | 'Winds'
  | 'Zones';

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
export type LayerState = {
  index: LayerName;
  visible: boolean;
  opacity: number;
  /**
   * The state of the objects on the layer.
   */
  objects: ObjectState[];
};

/**
 * The state of the layers of the map.
 */
export type Layers = {
  [key in LayerName]: LayerState;
};

/**
 * The state of the map.
 */
export type MapState = {
  layers: Layers;
};
