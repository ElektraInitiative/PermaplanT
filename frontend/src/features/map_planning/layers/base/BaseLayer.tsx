import { MAP_PIXELS_PER_METER } from '../../utils/Constants';
import { NextcloudKonvaImage } from '@/features/map_planning/components/NextcloudKonvaImage';
import useMapStore from '@/features/map_planning/store/MapStore';
import Konva from 'konva';
import { useState } from 'react';
import { Layer, Line } from 'react-konva';

import KonvaEventObject = Konva.KonvaEventObject;

const BaseLayer = ({ visible, opacity, listening }: Konva.LayerConfig) => {
  const trackedState = useMapStore((state) => state.trackedState.layers.Base);
  const untrackedState = useMapStore((state) => state.untrackedState.layers.Base);
  const setMeasurePoint = useMapStore((state) => state.baseLayerSetMeasurePoint);

  // It shouldn't matter whether the image path starts with a slash or not.
  let cleanImagePath = trackedState.nextcloudImagePath;
  if (cleanImagePath.startsWith('/')) {
    cleanImagePath = cleanImagePath.substring(1);
  }

  // Make sure that the image is centered on, and rotates around, the origin.
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

  const onload = (image: HTMLImageElement) => {
    if (imageOffset.x !== image.width / 2 || imageOffset.y !== image.height / 2)
      setImageOffset({ x: image.width / 2, y: image.height / 2 });
  };

  const measurementOnClick = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    setMeasurePoint(position);
  };

  const [hoverPoint, setHoverPoint] = useState({ x: 0, y: 0 });
  const measurementOnMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    setHoverPoint(position);
  };

  const measurementLinePoints = () => {
    switch (untrackedState.measureStep) {
      case 'inactive':
      case 'none selected':
        return [];

      case 'one selected':
        console.assert(untrackedState.measurePoint1 !== null);
        return [
          untrackedState.measurePoint1?.x ?? Number.NaN,
          untrackedState.measurePoint1?.y ?? Number.NaN,
          hoverPoint.x,
          hoverPoint.y,
        ];

      case 'both selected':
        console.assert(untrackedState.measurePoint1 !== null);
        console.assert(untrackedState.measurePoint2 !== null);
        return [
          untrackedState.measurePoint1?.x ?? Number.NaN,
          untrackedState.measurePoint1?.y ?? Number.NaN,
          untrackedState.measurePoint2?.x ?? Number.NaN,
          untrackedState.measurePoint2?.y ?? Number.NaN,
        ];
    }
  };

  const scale = trackedState.scale / MAP_PIXELS_PER_METER;

  return (
    <Layer
      listening={listening}
      visible={visible}
      opacity={opacity}
      draggable={false}
      onClick={measurementOnClick}
      onMouseMove={measurementOnMouseMove}
    >
      {/* Virtual ruler used to set the correct scale of the base layer. */}
      {cleanImagePath && (
        <NextcloudKonvaImage
          path={cleanImagePath}
          onload={onload}
          rotation={trackedState.rotation ?? 0}
          scaleX={scale}
          scaleY={scale}
          offset={imageOffset}
          draggable={false}
        />
      )}
      <Line points={measurementLinePoints()} strokeWidth={10} stroke="red" lineCap={'round'} />
    </Layer>
  );
};

export default BaseLayer;
