import { EdgeRing } from '@/features/map_planning/components/polygon/PolygonTypes';
import useMapStore from '@/features/map_planning/store/MapStore';
import { KonvaEventObject } from 'konva/lib/Node';
import { Circle, Group, Line } from 'react-konva';

export const Polygon = () => {
  const mapBounds = useMapStore((state) => state.trackedState.mapBounds);
  const polygonManipulationState = useMapStore(
    (state) => state.untrackedState.layers.base.polygon.editMode,
  );

  const setSingleNodeInTransformer = useMapStore((state) => state.setSingleNodeInTransformer);

  const handlePointClick = (e: KonvaEventObject<MouseEvent>) => {
    setSingleNodeInTransformer(e.currentTarget);
  };

  const handlePointDragEnd = (e: KonvaEventObject<DragEvent>) => {
    console.log('position', e.currentTarget.position());
  };

  const points = mapBounds.rings[0].map((point, index) => (
    <Circle
      index={index}
      draggable={true}
      key={`polygon-point-${index}`}
      x={point.x}
      y={point.y}
      fill="red"
      width={30}
      height={30}
      onClick={(e) => handlePointClick(e)}
      onDragEnd={(e) => handlePointDragEnd(e)}
    />
  ));

  return (
    <Group listening={polygonManipulationState === 'move'}>
      <Line
        listening={true}
        points={flattenRing(mapBounds.rings[0])}
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
