import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Circle, Group, Line } from 'react-konva';
import { UpdateMapGeometry } from '@/features/map_planning/layers/base/actions';
import useMapStore from '@/features/map_planning/store/MapStore';
import { DEFAULT_SRID } from '@/features/map_planning/types/PolygonTypes';
import {
  removePointAtIndex,
  setPointAtIndex,
  flattenRing,
  insertPointIntoLineSegmentWithLeastDistance,
} from '@/features/map_planning/utils/PolygonUtils';
import { useIsBaseLayerActive } from '@/features/map_planning/utils/layer-utils';
import { warningToastGrouped } from '@/features/toasts/groupedToast';
import { colors } from '@/utils/colors';

export const MapGeometryEditor = () => {
  const { t } = useTranslation('polygon');
  const executeAction = useMapStore((state) => state.executeAction);
  const trackedState = useMapStore((map) => map.trackedState);
  const mapGeometry = useMapStore((state) => state.trackedState.mapGeometry);
  const mapId = useMapStore((state) => state.untrackedState.mapId);
  const polygonManipulationState = useMapStore(
    (state) => state.untrackedState.layers.base.mapGeometry.editMode,
  );
  const editorLongestSide = useMapStore((map) =>
    Math.max(map.untrackedState.editorViewRect.width, map.untrackedState.editorViewRect.height),
  );
  const setSingleNodeInTransformer = useMapStore((state) => state.setSingleNodeInTransformer);
  const isBaseLayerActive = useIsBaseLayerActive();

  // The Konva-Group of this component is not listening while add mode is active.
  const onStageClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (polygonManipulationState !== 'add') return;

      const mapGeometry = useMapStore.getState().trackedState.mapGeometry;

      const newPoint = {
        x: e.currentTarget.getRelativePointerPosition().x,
        y: e.currentTarget.getRelativePointerPosition().y,
        srid: DEFAULT_SRID,
      };

      const geometry = insertPointIntoLineSegmentWithLeastDistance(
        mapGeometry,
        newPoint,
        editorLongestSide / 100,
      );
      executeAction(new UpdateMapGeometry({ geometry: geometry as object, mapId: mapId }));
    },
    [polygonManipulationState, editorLongestSide, executeAction, mapId],
  );

  useEffect(() => {
    const stageRef = useMapStore.getState().stageRef;
    stageRef.current?.on('click.shadeLayer', onStageClick);

    return () => {
      stageRef.current?.off('click.shadeLayer');
    };
  }, [onStageClick]);

  const handlePointSelect = (e: KonvaEventObject<MouseEvent>) => {
    if (polygonManipulationState === 'move') {
      setSingleNodeInTransformer(e.currentTarget);
      return;
    }

    if (polygonManipulationState !== 'remove') return;

    if (mapGeometry.rings[0].length - 1 <= 3) {
      warningToastGrouped(t('polygon_delete_point_forbidden'));
      return;
    }

    const index = e.currentTarget.index - 1;

    executeAction(
      new UpdateMapGeometry({
        geometry: removePointAtIndex(mapGeometry, index) as object,
        mapId: mapId,
      }),
    );
  };

  const handlePointDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (polygonManipulationState !== 'move') return;

    // Why is currentTarget.index always of any, anyby 1??
    const index = e.currentTarget.index - 1;

    const newPoint = {
      x: e.currentTarget.position().x,
      y: e.currentTarget.position().y,
      srid: DEFAULT_SRID,
    };

    executeAction(
      new UpdateMapGeometry({
        geometry: setPointAtIndex(mapGeometry, newPoint, index) as object,
        mapId: mapId,
      }),
    );
  };

  if (!trackedState.mapGeometry || !trackedState.mapGeometry.rings.length) return <Group></Group>;
  const points = mapGeometry.rings[0].map((point, index) => {
    if (index === mapGeometry.rings[0].length - 1) return;

    return (
      <Circle
        index={index}
        draggable={true}
        key={`polygon-point-${index}`}
        x={point.x}
        y={point.y}
        fill={colors.highlight.DEFAULT}
        radius={editorLongestSide / 200}
        onClick={(e) => handlePointSelect(e)}
        onDragStart={(e) => handlePointSelect(e)}
        onDragEnd={(e) => handlePointDragEnd(e)}
      />
    );
  });

  return (
    <Group
      visible={isBaseLayerActive}
      listening={polygonManipulationState === 'move' || polygonManipulationState === 'remove'}
    >
      <Line
        listening={true}
        points={flattenRing(mapGeometry.rings[0])}
        stroke={colors.highlight.DEFAULT}
        strokeWidth={editorLongestSide / 500}
        lineCap="round"
        closed={true}
      />
      {points}
    </Group>
  );
};
