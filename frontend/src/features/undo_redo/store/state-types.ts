/**
 * A union type of the map layer's names.
 */
export type LayerName = 'plant';

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
  /**
   * The state of the objects on the layer.
   */
  objects: ObjectState[];
};

/**
 * The state of the map.
 */
export type MapState = {
  /**
   * The state of the layers of the map.
   */
  layers: {
    [key in LayerName]: LayerState;
  };
};
