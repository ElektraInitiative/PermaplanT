//TODO #1123 - DrawingDto can be deleted will be autogenerated by backend
export type DrawingDto = {
  id: string;
  type: 'rectangle' | 'ellipse' | 'freeLine';
  layerId: number;
  addDate: string;
  rotation: number;
  properties: DrawingProperties;
};

export type DrawingProperties = RectangleProperties | EllipseProperties | FreeLineProperties;

export type RectangleProperties = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export type EllipseProperties = {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  color: string;
};

export type FreeLineProperties = {
  color: string;
  strokeWidth: number;
  points: number[];
};
