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
export type EdgeRing = Array<PolygonPoint>;

/**
 * Point that forms an edge ring.
 */
export type PolygonPoint = {
  /**
   * Position in the horizontal axis.
   */
  x: number;
  /**
   * Position in the vertical axis.
   */
  y: number;
  /**
   * ID of the coordinate type used by the backend.
   */
  srid: number;
};

export const DEFAULT_SRID = 4326;
