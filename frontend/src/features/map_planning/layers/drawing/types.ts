export type DrawingProperties = Record<string, string | number | number[] | number[][]>;

export type RectangleProperties = {
  width: number;
  height: number;
  fillPattern: string;
  color: string;
  strokeWidth: number;
};

export type EllipseProperties = {
  radiusX: number;
  radiusY: number;
  fillPattern: string;
  color: string;
  strokeWidth: number;
};

export type FreeLineProperties = {
  points: number[][];
  fillPattern: string;
  color: string;
  strokeWidth: number;
};

export type LabelTextProperties = {
  text: string;
  width: number;
  height: number;
};

export type ImageProperties = {
  path: string;
};
