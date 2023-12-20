import {
  calculateGeometryStats,
  Geometry,
} from '@/features/map_planning/layers/heatmap/util/geometry';

describe('Geometry', () => {
  it('calculates stats from geometry', () => {
    const geometry = {
      srid: '1234',
      rings: [
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: 1 },
        ],
        [
          { x: 7, y: 8 },
          { x: 8, y: 10 },
        ],
      ],
    };

    const geometryStats = calculateGeometryStats(geometry as Geometry);
    expect(geometryStats.width).toEqual(1);
    expect(geometryStats.height).toEqual(1);
    expect(geometryStats.maxX).toEqual(1);
    expect(geometryStats.maxY).toEqual(1);
    expect(geometryStats.minX).toEqual(0);
    expect(geometryStats.minY).toEqual(0);
  });
});
