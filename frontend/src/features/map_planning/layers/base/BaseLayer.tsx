import { MAP_PIXELS_PER_METER } from '../../utils/Constants';
import { LayerType } from '@/api_types/definitions';
import { NextcloudKonvaImage } from '@/features/map_planning/components/image/NextcloudKonvaImage';
import { MapGeometryEditor } from '@/features/map_planning/layers/base/components/PolygonEditor';
import useMapStore from '@/features/map_planning/store/MapStore';
import { LayerConfigWithListenerRegister } from '@/features/map_planning/types/layer-config';
import { COLOR_EDITOR_HIGH_VISIBILITY } from '@/utils/constants';
import { useCallback, useEffect, useState } from 'react';
import { Circle, Group, Layer, Line } from 'react-konva';

type BaseLayerProps = LayerConfigWithListenerRegister;

const BaseLayer = (props: BaseLayerProps) => {
  const { stageListenerRegister, ...layerProps } = props;
  const trackedState = useMapStore((map) => map.trackedState);
  const untrackedState = useMapStore((map) => map.untrackedState);

  /** Filepath to the background image in Nextcloud. */
  const nextcloudImagePath = trackedState.layers.base.nextcloudImagePath;
  /** Used to align the size of the background image with the real world. */
  const pixelsPerMeter = trackedState.layers.base.scale;
  /** The amount of rotation required to align the base layer with geographic north. */
  const rotation = trackedState.layers.base.rotation;

  const untrackedBaseLayerState = useMapStore((map) => map.untrackedState.layers.base);
  const baseLayerSetMeasurePoint = useMapStore((map) => map.baseLayerSetMeasurePoint);

  // Needed for scaling the auto-scale indicators.
  const editorLongestSide = useMapStore((map) =>
    Math.max(map.untrackedState.editorViewRect.width, map.untrackedState.editorViewRect.height),
  );

  const isBaseLayerActive =
    untrackedState.selectedLayer &&
    typeof untrackedState.selectedLayer === 'object' &&
    Object.hasOwn(untrackedState.selectedLayer, 'type_') &&
    untrackedState.selectedLayer.type_ === LayerType.Base;

  const measurementLinePoints = () => {
    if (untrackedBaseLayerState.autoScale.measureStep !== 'both selected') return [];

    return [
      untrackedBaseLayerState.autoScale.measurePoint1?.x ?? Number.NaN,
      untrackedBaseLayerState.autoScale.measurePoint1?.y ?? Number.NaN,
      untrackedBaseLayerState.autoScale.measurePoint2?.x ?? Number.NaN,
      untrackedBaseLayerState.autoScale.measurePoint2?.y ?? Number.NaN,
    ];
  };

  // It shouldn't matter whether the image path starts with a slash or not.
  // TODO: not sure if needed: double slash in a path is OK
  let cleanImagePath = nextcloudImagePath;
  if (cleanImagePath.startsWith('/')) {
    cleanImagePath = cleanImagePath.substring(1);
  }

  useEffect(() => {
    stageListenerRegister.registerStageClickListener('BaseLayer', (e) => {
      baseLayerSetMeasurePoint(e.currentTarget.getRelativePointerPosition());
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Make sure that the image is centered on, and rotates around, the origin.
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

  const onload = useCallback((image: HTMLImageElement) => {
    setImageOffset({ x: image.width / 2, y: image.height / 2 });
  }, []);

  const scale = MAP_PIXELS_PER_METER / pixelsPerMeter;

  return (
    <Layer {...layerProps} draggable={true}>
      <Group listening={false}>
        {cleanImagePath && (
          <NextcloudKonvaImage
            path={cleanImagePath}
            onload={onload}
            rotation={rotation ?? 0}
            scaleX={scale}
            scaleY={scale}
            offset={imageOffset}
          />
        )}
        {untrackedBaseLayerState.autoScale.measurePoint1 && (
          <Circle
            x={untrackedBaseLayerState.autoScale.measurePoint1.x}
            y={untrackedBaseLayerState.autoScale.measurePoint1.y}
            radius={editorLongestSide / 250}
            fill={COLOR_EDITOR_HIGH_VISIBILITY}
          />
        )}
        {untrackedBaseLayerState.autoScale.measurePoint2 && (
          <Circle
            x={untrackedBaseLayerState.autoScale.measurePoint2.x}
            y={untrackedBaseLayerState.autoScale.measurePoint2.y}
            radius={editorLongestSide / 250}
            fill={COLOR_EDITOR_HIGH_VISIBILITY}
          />
        )}
        <Line
          points={measurementLinePoints()}
          strokeWidth={editorLongestSide / 500}
          stroke={COLOR_EDITOR_HIGH_VISIBILITY}
        />
      </Group>
      <MapGeometryEditor show={isBaseLayerActive} {...props} />
    </Layer>
  );
};

export default BaseLayer;
