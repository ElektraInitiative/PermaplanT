/**
 * Represents an array of closed edge loops.
 */
export type Geometry = {
  rings: Array<Array<{ x: number; y: number }>>;
  srid: string;
};

/**
 * Contains additional geometry properties that need to be derived in the frontend.
 */
export type GeometryStats = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};

/**
 * Derive GeometryStats from a Geometry object.
 * CAUTION: for simplicity reasons only the first edge loop will be considered.
 *
 * @param geometry The object for which GeometryStats should be generated.
 */
export function calculateGeometryStats(geometry: Geometry): GeometryStats {
  const firstEdgeRing = geometry.rings[0];
  let minX = firstEdgeRing[0].x;
  let maxX = firstEdgeRing[0].x;
  let minY = firstEdgeRing[0].y;
  let maxY = firstEdgeRing[0].y;

  for (const point of firstEdgeRing) {
    minX = Math.min(point.x, minX);
    maxX = Math.max(point.x, maxX);
    minY = Math.min(point.y, minY);
    maxY = Math.max(point.y, maxY);
  }

  const width = Math.abs(maxX - minX);
  const height = Math.abs(maxY - minY);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
  };
}
