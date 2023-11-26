import { UpdateMapGeometry } from '@/features/map_planning/layers/base/actions';
import {
  DEFAULT_SRID,
  EdgeRing,
} from '@/features/map_planning/layers/base/components/polygon/PolygonTypes';
import {
  insertBetweenPointsWithLeastTotalDistance,
  removePointAtIndex,
} from '@/features/map_planning/layers/base/components/polygon/PolygonUtils';
import useMapStore from '@/features/map_planning/store/MapStore';
import { LayerConfigWithListenerRegister } from '@/features/map_planning/types/layer-config';
import { COLOR_EDITOR_HIGH_VISIBILITY } from '@/utils/constants';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect } from 'react';
import { Circle, Group, Line } from 'react-konva';

export interface PolygonProps extends LayerConfigWithListenerRegister {
  show: boolean;
}

export const Polygon = (props: PolygonProps) => {
  const executeAction = useMapStore((state) => state.executeAction);
  const trackedState = useMapStore((map) => map.trackedState);
  const mapBounds = useMapStore((state) => state.trackedState.mapBounds);
  const mapId = useMapStore((state) => state.untrackedState.mapId);
  const polygonManipulationState = useMapStore(
    (state) => state.untrackedState.layers.base.polygon.editMode,
  );
  const editorLongestSide = useMapStore((map) =>
    Math.max(map.untrackedState.editorBounds.width, map.untrackedState.editorBounds.height),
  );
  const setSingleNodeInTransformer = useMapStore((state) => state.setSingleNodeInTransformer);

  // The Konva-Group of this component is not listening while add mode is active.
  useEffect(() => {
    props.stageListenerRegister.registerStageClickListener('Polygon', (e) => {
      if (polygonManipulationState !== 'add') return;

      const newPoint = {
        x: e.currentTarget.getRelativePointerPosition().x,
        y: e.currentTarget.getRelativePointerPosition().y,
        srid: DEFAULT_SRID,
      };

      const geometry = insertBetweenPointsWithLeastTotalDistance(mapBounds, newPoint);
      executeAction(new UpdateMapGeometry({ geometry: geometry as object, mapId: mapId }));
    });
  }, [polygonManipulationState]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointSelect = (e: KonvaEventObject<MouseEvent>) => {
    if (polygonManipulationState === 'move') {
      setSingleNodeInTransformer(e.currentTarget);
      return;
    }

    if (polygonManipulationState !== 'remove') return;

    const index = e.currentTarget.index - 1;

    executeAction(
      new UpdateMapGeometry({
        geometry: removePointAtIndex(mapBounds, index) as object,
        mapId: mapId,
      }),
    );
  };

  const handlePointDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (polygonManipulationState !== 'move') return;

    // Why is currentTarget.index always of by 1??
    const index = e.currentTarget.index - 1;
    const geometry = mapBounds;

    geometry.rings[0][index] = {
      x: e.currentTarget.position().x,
      y: e.currentTarget.position().y,
      srid: DEFAULT_SRID,
    };
    // The backend expects that the first point equals the last point.
    if (index === 0) {
      const ringLength = geometry.rings[0].length;
      geometry.rings[0][ringLength - 1] = geometry.rings[0][0];
    }

    executeAction(new UpdateMapGeometry({ geometry: geometry as object, mapId: mapId }));
  };

  if (!trackedState.mapBounds || !trackedState.mapBounds.rings.length) return <Group></Group>;

  const points = mapBounds.rings[0].map((point, index) => {
    if (index === mapBounds.rings[0].length - 1) return;

    return (
      <Circle
        index={index}
        draggable={true}
        key={`polygon-point-${index}`}
        x={point.x}
        y={point.y}
        fill="red"
        radius={editorLongestSide / 200}
        onClick={(e) => handlePointSelect(e)}
        onDragStart={(e) => handlePointSelect(e)}
        onDragEnd={(e) => handlePointDragEnd(e)}
      />
    );
  });

  return (
    <Group
      visible={props.show}
      listening={polygonManipulationState === 'move' || polygonManipulationState === 'remove'}
    >
      <Line
        listening={true}
        points={flattenRing(mapBounds.rings[0])}
        stroke={COLOR_EDITOR_HIGH_VISIBILITY}
        strokeWidth={editorLongestSide / 500}
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
