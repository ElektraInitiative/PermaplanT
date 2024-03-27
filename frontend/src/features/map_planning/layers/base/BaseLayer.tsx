import Konva from 'konva';
import { useCallback, useState } from 'react';
import { Circle, Group, Layer, Line } from 'react-konva';
import { NextcloudKonvaImage } from '@/features/map_planning/components/image/NextcloudKonvaImage';
import { MapGeometryEditor } from '@/features/map_planning/layers/base/components/MapGeometryEditor';
import useMapStore from '@/features/map_planning/store/MapStore';
import { colors } from '@/utils/colors';
import { MAP_PIXELS_PER_METER } from '../../utils/Constants';

type BaseLayerProps = Konva.LayerConfig;

const BaseLayer = (props: BaseLayerProps) => {
  const trackedState = useMapStore((map) => map.trackedState);

  /** Filepath to the background image in Nextcloud. */
  const nextcloudImagePath = trackedState.layers.base.nextcloudImagePath;
  /** Used to align the size of the background image with the real world. */
  const pixelsPerMeter = trackedState.layers.base.scale;
  /** The amount of rotation required to align the base layer with geographic north. */
  const rotation = trackedState.layers.base.rotation;

  const untrackedBaseLayerState = useMapStore((map) => map.untrackedState.layers.base);

  // Needed for scaling the auto-scale indicators.
  const editorLongestSide = useMapStore((map) =>
    Math.max(map.untrackedState.editorViewRect.width, map.untrackedState.editorViewRect.height),
  );

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

  useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    useMapStore.getState().baseLayerSetMeasurePoint(e.currentTarget.getRelativePointerPosition());
  }, []);

  // Make sure that the image is centered on, and rotates around, the origin.
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

  const onload = useCallback((image: HTMLImageElement) => {
    setImageOffset({ x: image.width / 2, y: image.height / 2 });
  }, []);

  const scale = MAP_PIXELS_PER_METER / pixelsPerMeter;

  return (
    <Layer {...props} draggable={true}>
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
            fill={colors.highlight.DEFAULT}
          />
        )}
        {untrackedBaseLayerState.autoScale.measurePoint2 && (
          <Circle
            x={untrackedBaseLayerState.autoScale.measurePoint2.x}
            y={untrackedBaseLayerState.autoScale.measurePoint2.y}
            radius={editorLongestSide / 250}
            fill={colors.highlight.DEFAULT}
          />
        )}
        <Line
          points={measurementLinePoints()}
          strokeWidth={editorLongestSide / 500}
          stroke={colors.highlight.DEFAULT}
        />
      </Group>
      <MapGeometryEditor />
    </Layer>
  );
};

export default BaseLayer;
