import {
  EdgeRing,
  PolygonGeometry,
  PolygonPoint,
} from '@/features/map_planning/types/PolygonTypes';
import {
  flattenRing,
  insertPointIntoLineSegmentWithLeastDistance,
  removePointAtIndex,
  setPointAtIndex,
} from '@/features/map_planning/utils/PolygonUtils';

describe('Flatten Polygon rings', () => {
  it('should return all x and y coordinates as an array', () => {
    const ring: EdgeRing = [
      { x: 0, y: 1, srid: 0 },
      { x: 2, y: 3, srid: 0 },
      { x: 4, y: 5, srid: 0 },
      { x: 6, y: 7, srid: 0 },
      { x: 0, y: 1, srid: 0 },
    ];

    expect(flattenRing(ring)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 0, 1]);
  });
});

describe('Modify a point in a specified edge ring', () => {
  it('should change the first edge ring if no specific edge ring was selected', () => {
    const ring: EdgeRing = [
      { x: 0, y: 1, srid: 0 },
      { x: 2, y: 3, srid: 0 },
      { x: 4, y: 5, srid: 0 },
      { x: 6, y: 7, srid: 0 },
      { x: 0, y: 1, srid: 0 },
    ];

    const polygon: PolygonGeometry = {
      rings: [ring, ring],
      srid: '',
    };

    expect(setPointAtIndex(polygon, { x: 99, y: 99, srid: 0 }, 0)).toEqual({
      rings: [
        [
          { x: 99, y: 99, srid: 0 },
          { x: 2, y: 3, srid: 0 },
          { x: 4, y: 5, srid: 0 },
          { x: 6, y: 7, srid: 0 },
          { x: 99, y: 99, srid: 0 },
        ],
        [
          { x: 0, y: 1, srid: 0 },
          { x: 2, y: 3, srid: 0 },
          { x: 4, y: 5, srid: 0 },
          { x: 6, y: 7, srid: 0 },
          { x: 0, y: 1, srid: 0 },
        ],
      ],
      srid: '',
    });
  });

  it('should change the second edge ring if the second edge ring was selected', () => {
    const ring: EdgeRing = [
      { x: 0, y: 1, srid: 0 },
      { x: 2, y: 3, srid: 0 },
      { x: 4, y: 5, srid: 0 },
      { x: 6, y: 7, srid: 0 },
      { x: 0, y: 1, srid: 0 },
    ];

    const polygon: PolygonGeometry = {
      rings: [ring, ring],
      srid: '',
    };

    expect(setPointAtIndex(polygon, { x: 99, y: 99, srid: 0 }, 0, 1)).toEqual({
      rings: [
        [
          { x: 0, y: 1, srid: 0 },
          { x: 2, y: 3, srid: 0 },
          { x: 4, y: 5, srid: 0 },
          { x: 6, y: 7, srid: 0 },
          { x: 0, y: 1, srid: 0 },
        ],
        [
          { x: 99, y: 99, srid: 0 },
          { x: 2, y: 3, srid: 0 },
          { x: 4, y: 5, srid: 0 },
          { x: 6, y: 7, srid: 0 },
          { x: 99, y: 99, srid: 0 },
        ],
      ],
      srid: '',
    });
  });
});

describe('Remove a point in a specified edge ring', () => {
  it('should delete from the first edge ring if no specific edge ring was selected', () => {
    const ring: EdgeRing = [
      { x: 0, y: 1, srid: 0 },
      { x: 2, y: 3, srid: 0 },
      { x: 4, y: 5, srid: 0 },
      { x: 6, y: 7, srid: 0 },
      { x: 0, y: 1, srid: 0 },
    ];

    const polygon: PolygonGeometry = {
      rings: [ring, ring],
      srid: '',
    };

    expect(removePointAtIndex(polygon, 1)).toEqual({
      rings: [
        [
          { x: 0, y: 1, srid: 0 },
          { x: 4, y: 5, srid: 0 },
          { x: 6, y: 7, srid: 0 },
          { x: 0, y: 1, srid: 0 },
        ],
        [
          { x: 0, y: 1, srid: 0 },
          { x: 2, y: 3, srid: 0 },
          { x: 4, y: 5, srid: 0 },
          { x: 6, y: 7, srid: 0 },
          { x: 0, y: 1, srid: 0 },
        ],
      ],
      srid: '',
    });
  });

  it('should delete from the second edge ring if the second edge ring was selected', () => {
    const ring: EdgeRing = [
      { x: 0, y: 1, srid: 0 },
      { x: 2, y: 3, srid: 0 },
      { x: 4, y: 5, srid: 0 },
      { x: 6, y: 7, srid: 0 },
      { x: 0, y: 1, srid: 0 },
    ];

    const polygon: PolygonGeometry = {
      rings: [ring, ring],
      srid: '',
    };

    expect(removePointAtIndex(polygon, 1, 1)).toEqual({
      rings: [
        [
          { x: 0, y: 1, srid: 0 },
          { x: 2, y: 3, srid: 0 },
          { x: 4, y: 5, srid: 0 },
          { x: 6, y: 7, srid: 0 },
          { x: 0, y: 1, srid: 0 },
        ],
        [
          { x: 0, y: 1, srid: 0 },
          { x: 4, y: 5, srid: 0 },
          { x: 6, y: 7, srid: 0 },
          { x: 0, y: 1, srid: 0 },
        ],
      ],
      srid: '',
    });
  });

  it('should copy the second point at the end to the edge ring after if first point was removed', () => {
    const ring: EdgeRing = [
      { x: 0, y: 1, srid: 0 },
      { x: 2, y: 3, srid: 0 },
      { x: 4, y: 5, srid: 0 },
      { x: 6, y: 7, srid: 0 },
      { x: 0, y: 1, srid: 0 },
    ];

    const polygon: PolygonGeometry = {
      rings: [ring, ring],
      srid: '',
    };

    expect(removePointAtIndex(polygon, 0)).toEqual({
      rings: [
        [
          { x: 2, y: 3, srid: 0 },
          { x: 4, y: 5, srid: 0 },
          { x: 6, y: 7, srid: 0 },
          { x: 2, y: 3, srid: 0 },
        ],
        [
          { x: 0, y: 1, srid: 0 },
          { x: 2, y: 3, srid: 0 },
          { x: 4, y: 5, srid: 0 },
          { x: 6, y: 7, srid: 0 },
          { x: 0, y: 1, srid: 0 },
        ],
      ],
      srid: '',
    });
  });
});

describe('Add a point between the two nearest points', () => {
  test('It adds a point between the first and second point of the first edge ring', () => {
    const square: EdgeRing = [
      { x: 0, y: 0, srid: 0 },
      { x: 1, y: 0, srid: 0 },
      { x: 1, y: 1, srid: 0 },
      { x: 0, y: 1, srid: 0 },
      { x: 0, y: 0, srid: 0 },
    ];

    const newPoint: PolygonPoint = { x: 0.5, y: 0, srid: 0 };

    const polygon: PolygonGeometry = {
      rings: [square, square],
      srid: '',
    };

    expect(insertPointIntoLineSegmentWithLeastDistance(polygon, newPoint, 0)).toEqual({
      rings: [
        [
          { x: 0, y: 0, srid: 0 },
          { x: 0.5, y: 0, srid: 0 },
          { x: 1, y: 0, srid: 0 },
          { x: 1, y: 1, srid: 0 },
          { x: 0, y: 1, srid: 0 },
          { x: 0, y: 0, srid: 0 },
        ],
        [
          { x: 0, y: 0, srid: 0 },
          { x: 1, y: 0, srid: 0 },
          { x: 1, y: 1, srid: 0 },
          { x: 0, y: 1, srid: 0 },
          { x: 0, y: 0, srid: 0 },
        ],
      ],
      srid: '',
    });
  });
});
