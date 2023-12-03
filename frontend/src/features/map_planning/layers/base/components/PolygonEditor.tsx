import { UpdateMapGeometry } from '@/features/map_planning/layers/base/actions';
import useMapStore from '@/features/map_planning/store/MapStore';
import { DEFAULT_SRID } from '@/features/map_planning/types/PolygonTypes';
import { LayerConfigWithListenerRegister } from '@/features/map_planning/types/layer-config';
import {
  insertBetweenPointsWithLeastTotalDistance,
  removePointAtIndex,
  setPointAtIndex,
  flattenRing,
} from '@/features/map_planning/utils/PolygonUtils';
import { warningToastGrouped } from '@/features/toasts/groupedToast';
import { COLOR_EDITOR_HIGH_VISIBILITY } from '@/utils/constants';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Circle, Group, Line } from 'react-konva';

export interface PolygonProps extends LayerConfigWithListenerRegister {
  show: boolean;
}

export const PolygonEditor = (props: PolygonProps) => {
  const { t } = useTranslation('polygon');
  const executeAction = useMapStore((state) => state.executeAction);
  const trackedState = useMapStore((map) => map.trackedState);
  const viewRect = useMapStore((state) => state.trackedState.mapBounds);
  const mapId = useMapStore((state) => state.untrackedState.mapId);
  const polygonManipulationState = useMapStore(
    (state) => state.untrackedState.layers.base.polygon.editMode,
  );
  const editorLongestSide = useMapStore((map) =>
    Math.max(map.untrackedState.editorViewRect.width, map.untrackedState.editorViewRect.height),
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

      const geometry = insertBetweenPointsWithLeastTotalDistance(viewRect, newPoint);
      executeAction(new UpdateMapGeometry({ geometry: geometry as object, mapId: mapId }));
    });
  }, [polygonManipulationState]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointSelect = (e: KonvaEventObject<MouseEvent>) => {
    if (polygonManipulationState === 'move') {
      setSingleNodeInTransformer(e.currentTarget);
      return;
    }

    if (polygonManipulationState !== 'remove') return;

    if (viewRect.rings[0].length - 1 <= 3) {
      warningToastGrouped(t('polygon_delete_point_forbidden'));
      return;
    }

    const index = e.currentTarget.index - 1;

    executeAction(
      new UpdateMapGeometry({
        geometry: removePointAtIndex(viewRect, index) as object,
        mapId: mapId,
      }),
    );
  };

  const handlePointDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (polygonManipulationState !== 'move') return;

    // Why is currentTarget.index always of by 1??
    const index = e.currentTarget.index - 1;

    const newPoint = {
      x: e.currentTarget.position().x,
      y: e.currentTarget.position().y,
      srid: DEFAULT_SRID,
    };

    executeAction(
      new UpdateMapGeometry({
        geometry: setPointAtIndex(viewRect, newPoint, index) as object,
        mapId: mapId,
      }),
    );
  };

  if (!trackedState.mapBounds || !trackedState.mapBounds.rings.length) return <Group></Group>;

  const points = viewRect.rings[0].map((point, index) => {
    if (index === viewRect.rings[0].length - 1) return;

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
        points={flattenRing(viewRect.rings[0])}
        stroke={COLOR_EDITOR_HIGH_VISIBILITY}
        strokeWidth={editorLongestSide / 500}
        lineCap="round"
        closed={true}
      />
      {points}
    </Group>
  );
};
