//TODO #1123 - Some types will be generated by backend in the future
export type DrawingShapeType = 'rectangle' | 'ellipse' | 'freeLine' | 'bezierPolygon';

export type DrawingDto = {
  id: string;
  type: DrawingShapeType;
  layerId: number;
  addDate?: string;
  removeDate?: string;
  rotation: number;
  scaleX: number;
  scaleY: number;
  x: number;
  y: number;
  color: string;
  strokeWidth?: number;
  properties: DrawingProperties;
};

export type DrawingProperties = Record<string, string | number | number[] | number[][]>;

export type MoveDrawingActionPayload = {
  userId: string;
  actionId: string;
  id: string;
  x: number;
  y: number;
};

export type TransformDrawingActionPayload = {
  userId: string;
  actionId: string;
  id: string;
  rotation: number;
  scaleX: number;
  scaleY: number;
  x: number;
  y: number;
};

export type CreateDrawingActionPayload = {
  userId: string;
  actionId: string;
  id: string;
  type: DrawingShapeType;
  layerId: number;
  addDate: string;
  x: number;
  y: number;
  properties: DrawingProperties;
};

export interface UpdateAddDateDrawingDto {
  addDate?: string;
  actionId: string;
}

export interface UpdateDrawingAddDateActionPayload {
  userId: string;
  actionId: string;
  id: string;
  addDate?: string;
}

export interface UpdateDrawingRemoveDateActionPayload {
  userId: string;
  actionId: string;
  id: string;
  removeDate?: string;
}

export interface UpdateDrawingPropertiesActionPayload {
  userId: string;
  actionId: string;
  id: string;
  properties: DrawingProperties;
}

export interface UpdateDrawingColorActionPayload {
  userId: string;
  actionId: string;
  id: string;
  color: string;
}

export interface UpdateDrawingStrokeWidthActionPayload {
  userId: string;
  actionId: string;
  id: string;
  strokeWidth?: number;
}

export interface UpdateRemoveDateDrawingDto {
  removeDate?: string;
  actionId: string;
}

export type RectangleProperties = {
  width: number;
  height: number;
};

export type EllipseProperties = {
  radiusX: number;
  radiusY: number;
};

export type FreeLineProperties = {
  points: number[][];
};
