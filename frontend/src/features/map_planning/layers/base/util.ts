import { Vector2d } from 'konva/lib/types';

export const calculateScale = (
  measuredDistancePixels: number,
  oldScale: number,
  actualDistanceCentimeters: number,
): number => {
  if (oldScale === 0 || actualDistanceCentimeters === 0) return 0;
  return Math.floor(measuredDistancePixels / (actualDistanceCentimeters / oldScale));
};

export const calculateDistance = (point1: Vector2d, point2: Vector2d) => {
  const lengthX = Math.abs(point2.x - point1.x);
  const lengthY = Math.abs(point2.y - point1.y);
  return Math.sqrt(lengthX * lengthX + lengthY * lengthY);
};
