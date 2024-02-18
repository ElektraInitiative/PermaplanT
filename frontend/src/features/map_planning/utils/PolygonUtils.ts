import { calculateDistance } from '@/features/map_planning/layers/base/util';
import {
  EdgeRing,
  PolygonGeometry,
  PolygonPoint,
} from '@/features/map_planning/types/PolygonTypes';

/**
 * Try to insert pointToInsert between the two points in geometry where the distance between pointToInsert and the
 * line segment formed by the two points is minimal.
 * If this does not work (e.g. because the distance is undefined for all line segments), the algorithm will fall
 * back to insertBetweenPointsWithLeastTotalDistance.
 *
 * @param geometry PolygonGeometry object, that will receive pointToInsert.
 * @param pointToInsert The new point, that will be inserted to geometry.
 * @param minCoordinateDelta
 * @param edgeRing Index of the edge ring that will receive pointToInsert. Defaults to 0 if undefined.
 */
export function insertPointIntoLineSegmentWithLeastDistance(
  geometry: PolygonGeometry,
  pointToInsert: PolygonPoint,
  minCoordinateDelta: number,
  edgeRing?: number,
): PolygonGeometry {
  const newGeometry: PolygonGeometry = deepCopyGeometry(geometry);

  let smallestTotalDistanceToLine = Infinity;
  let insertNewPointAfterIndex = -1;

  geometry.rings[edgeRing ?? 0]
    // the last point is identical to the first point
    .slice(0, geometry.rings[edgeRing ?? 0].length - 1)
    .forEach((value, index, array) => {
      const firstPoint = value;
      const secondPoint = array[(index + 1) % array.length];

      // Due to winding order we don't know how the first and second point are situated relative to each other.
      const leftPoint = firstPoint.x < secondPoint.x ? firstPoint : secondPoint;
      const rightPoint = firstPoint.x > secondPoint.x ? firstPoint : secondPoint;
      const lowerPoint = firstPoint.y < secondPoint.y ? firstPoint : secondPoint;
      const upperPoint = firstPoint.y > secondPoint.y ? firstPoint : secondPoint;

      const newPointBetweenFirstAndSecondPointX =
        leftPoint.x < pointToInsert.x &&
        rightPoint.x > pointToInsert.x &&
        Math.abs(rightPoint.x - leftPoint.x) > minCoordinateDelta;
      const newPointBetweenFirstAndSecondPointY =
        lowerPoint.y < pointToInsert.y &&
        upperPoint.y > pointToInsert.y &&
        Math.abs(rightPoint.y - leftPoint.y) > minCoordinateDelta;

      // The distance calculation below would no longer be accurate because the formula was designed for lines of
      // infinite length that go through points instead of fixed length line segments.
      if (!newPointBetweenFirstAndSecondPointX && !newPointBetweenFirstAndSecondPointY) return;

      // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
      const distanceToLine =
        Math.abs(
          (secondPoint.x - firstPoint.x) * (firstPoint.y - pointToInsert.y) -
            (firstPoint.x - pointToInsert.x) * (secondPoint.y - firstPoint.y),
        ) /
        Math.sqrt(
          (secondPoint.x - firstPoint.x) * (secondPoint.x - firstPoint.x) +
            (secondPoint.y - firstPoint.y) * (secondPoint.y - firstPoint.y),
        );

      if (distanceToLine < smallestTotalDistanceToLine) {
        smallestTotalDistanceToLine = distanceToLine;
        insertNewPointAfterIndex = index;
      }
    });

  // The algorithm above might discard all line segments in some cases.
  // If this is the case we use the function bellow as our "fallback-algorithm"
  if (insertNewPointAfterIndex == -1)
    return insertBetweenPointsWithLeastTotalDistance(newGeometry, pointToInsert, edgeRing);

  const ring = newGeometry.rings[edgeRing ?? 0];
  newGeometry.rings[edgeRing ?? 0] = ring
    .slice(0, insertNewPointAfterIndex + 1)
    .concat([pointToInsert])
    .concat(ring.slice(insertNewPointAfterIndex + 1, ring.length));

  return newGeometry;
}

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
  const newGeometry: PolygonGeometry = deepCopyGeometry(geometry);

  let smallestTotalDistance = Infinity;
  let insertNewPointAfterIndex = -1;

  newGeometry.rings[edgeRing ?? 0]
    // the last point is identical to the first point
    .slice(0, newGeometry.rings[edgeRing ?? 0].length - 1)
    .forEach((value, index, array) => {
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

  const ring = newGeometry.rings[edgeRing ?? 0];
  newGeometry.rings[edgeRing ?? 0] = ring
    .slice(0, insertNewPointAfterIndex + 1)
    .concat([pointToInsert])
    .concat(ring.slice(insertNewPointAfterIndex + 1, ring.length));

  return newGeometry;
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
  const newGeometry: PolygonGeometry = deepCopyGeometry(geometry);
  const ring = newGeometry.rings[edgeRing ?? 0];
  newGeometry.rings[edgeRing ?? 0] = ring
    .slice(0, indexToRemove)
    .concat(ring.slice(indexToRemove + 1, ring.length));

  if (indexToRemove == 0) {
    const ringLength = newGeometry.rings[edgeRing ?? 0].length;
    newGeometry.rings[edgeRing ?? 0][ringLength - 1] = newGeometry.rings[edgeRing ?? 0][0];
  }

  return newGeometry;
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
  const newGeometry: PolygonGeometry = deepCopyGeometry(geometry);

  newGeometry.rings[edgeRing ?? 0][indexToUpdate] = newPoint;

  // The backend expects that the first point equals the last point.
  if (indexToUpdate === 0) {
    const ringLength = newGeometry.rings[edgeRing ?? 0].length;
    newGeometry.rings[edgeRing ?? 0][ringLength - 1] = newGeometry.rings[edgeRing ?? 0][0];
  }

  return newGeometry;
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

/**
 * Creates a deep copy of a geometry object.
 */
function deepCopyGeometry(geometry: PolygonGeometry): PolygonGeometry {
  return JSON.parse(JSON.stringify(geometry));
}
