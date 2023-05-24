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

export type LayerAttributes<T extends LayerName> =
      T extends 'Base' ? {imageURL: string, rotation: number, scale: number} : never
    | T extends 'Plant' ? undefined : never // add more attribute types like this
    | undefined;

/**
 * The state of a map's layer.
 */
export type LayerState<Name extends LayerName> = {
  index: Name;
  visible: boolean;
  opacity: number;
  /**
   * The state of the objects on the layer.
   */
  objects: ObjectState[];
  /**
   * Stores data that is custom for a specific layer.
   * E.g. background image, scale and rotation for the base layer.
   */
  attributes: LayerAttributes<Name>;
};

/**
 * The state of the layers of the map.
 */
export type Layers = {
  [key in LayerName]: LayerState<key>;
};

/**
 * The state of the map.
 */
export type MapState = {
  selectedLayer: LayerName;
  layers: Layers;
};
