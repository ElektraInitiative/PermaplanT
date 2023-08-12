import { EdgeRing, PolygonGeometry } from '@/features/map_planning/components/polygon/PolygonTypes';
import { Circle, Group, Line } from 'react-konva';

export interface PolygonProps {
  /** Geometry data that should be displayed by this component. */
  geometry: PolygonGeometry;
}

export const Polygon = (props: PolygonProps) => {
  const points = props.geometry.rings[0].map((point, index) => (
    <Circle
      key={`polygon-point-${index}`}
      x={point.x}
      y={point.y}
      fill="red"
      width={30}
      height={30}
    />
  ));

  return (
    <Group>
      <Line
        listening={true}
        points={flattenRing(props.geometry.rings[0])}
        stroke="red"
        strokeWidth={10}
        lineCap="round"
        closed={true}
      />
      {points}
    </Group>
  );
};

/**
 * Extract the coordinates from an edge ring and put them in a flattened array.
 *
 * @param ring The ring to flatten.
 */
function flattenRing(ring: EdgeRing): number[] {
  return ring
    .map((point) => [point.x, point.y])
    .reduce((accumulator, next) => accumulator.concat(next));
}
