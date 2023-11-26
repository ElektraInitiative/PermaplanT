import {
  PolygonGeometry,
  PolygonPoint,
} from '@/features/map_planning/layers/base/components/polygon/PolygonTypes';
import { calculateDistance } from '@/features/map_planning/layers/base/util';

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
