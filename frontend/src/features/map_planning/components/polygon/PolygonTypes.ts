/**
 * All polygons returned from the backend are returned in this format.
 * See backend/src/model/dto.rs for details.
 */
export type PolygonGeometry = {
  /**
   * ID of the coordinate type used by the backend.
   */
  srid: string;
  /**
   * Coordinate data used to construct the polygon.
   */
  rings: Array<EdgeRing>;
};

/**
 * Polygons can have multiple edge rings (i.e. multiple independent areas).
 * Each edge ring is assumed to be wound counterclockwise with lines connecting two neighboring points.
 */
export type EdgeRing = Array<{ x: number; y: number }>;
