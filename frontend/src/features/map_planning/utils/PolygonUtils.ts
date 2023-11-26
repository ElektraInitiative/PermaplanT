import { calculateDistance } from '@/features/map_planning/layers/base/util';
import {
  EdgeRing,
  PolygonGeometry,
  PolygonPoint,
} from '@/features/map_planning/utils/PolygonTypes';

/**
 * Insert a PolygonPoint P into an edge Ring of a PolygonGeometry object between
 * the two points with the smallest cumulative distance to P.
 *
 * @param geometry PolygonGeometry object, that will receive pointToInsert.
 * @param pointToInsert The new point, that will be inserted to geometry (equal to P in the description above).
 * @param edgeRing Index of the edge ring that will receive pointToInsert. Defaults to 0 if undefined.
 */
export function insertBetweenPointsWithLeastTotalDistance(
  geometry: PolygonGeometry,
  pointToInsert: PolygonPoint,
  edgeRing?: number,
): PolygonGeometry {
  let smallestTotalDistance = Infinity;
  let insertNewPointAfterIndex = -1;
  geometry.rings[edgeRing ?? 0].forEach((value, index, array) => {
    const firstPoint = value;
    const secondPoint = array[(index + 1) % array.length];

    const distanceOne = calculateDistance(pointToInsert, firstPoint);
    const distanceTwo = calculateDistance(pointToInsert, secondPoint);

    const totalDistance = distanceOne + distanceTwo;
    if (totalDistance < smallestTotalDistance) {
      smallestTotalDistance = totalDistance;
      insertNewPointAfterIndex = index;
    }
  });

  const ring = geometry.rings[edgeRing ?? 0];
  geometry.rings[edgeRing ?? 0] = ring
    .slice(0, insertNewPointAfterIndex + 1)
    .concat([pointToInsert])
    .concat(ring.slice(insertNewPointAfterIndex + 1, ring.length));

  return geometry;
}

/**
 * Removes a point from the PolygonGeometry object.
 *
 * @param geometry The object the point should be removed from.
 * @param indexToRemove The index of the point to be removed
 * @param edgeRing The edge ring that the point should be removed from. Defaults to 0 if undefined.
 */
export function removePointAtIndex(
  geometry: PolygonGeometry,
  indexToRemove: number,
  edgeRing?: number,
) {
  const ring = geometry.rings[edgeRing ?? 0];
  geometry.rings[edgeRing ?? 0] = ring
    .slice(0, indexToRemove)
    .concat(ring.slice(indexToRemove + 1, ring.length));
  return geometry;
}

/**
 * Update a point of a PolygonGeometry object, while making sure that no invariants are violated.
 *
 * @param geometry Object to be updated.
 * @param newPoint New point data.
 * @param indexToUpdate The index of the point that should be replaced.
 * @param edgeRing The index of the edge ring that should be updated. Defaults to 0 if undefined.
 */
export function setPointAtIndex(
  geometry: PolygonGeometry,
  newPoint: PolygonPoint,
  indexToUpdate: number,
  edgeRing?: number,
): PolygonGeometry {
  geometry.rings[edgeRing ?? 0][indexToUpdate] = newPoint;

  // The backend expects that the first point equals the last point.
  if (indexToUpdate === 0) {
    const ringLength = geometry.rings[edgeRing ?? 0].length;
    geometry.rings[edgeRing ?? 0][ringLength - 1] = geometry.rings[edgeRing ?? 0][0];
  }

  return geometry;
}

/**
 * Extract the coordinates from an edge ring and put them in a flattened array.
 *
 * @param ring The ring to flatten.
 */
export function flattenRing(ring: EdgeRing): number[] {
  return ring
    .map((point) => [point.x, point.y])
    .reduce((accumulator, next) => accumulator.concat(next));
}
