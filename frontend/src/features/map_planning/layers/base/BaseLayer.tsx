import { MAP_PIXELS_PER_METER } from '../../utils/Constants';
import { NextcloudKonvaImage } from '@/features/map_planning/components/NextcloudKonvaImage';
import { MeasurementGroup } from '@/features/map_planning/layers/base/groups/MeasurementGroup';
import useMapStore from '@/features/map_planning/store/MapStore';
import Konva from 'konva';
import { useState } from 'react';
import { Layer } from 'react-konva';

import KonvaEventObject = Konva.KonvaEventObject;

const BaseLayer = ({ visible, opacity, listening }: Konva.LayerConfig) => {
  const trackedState = useMapStore((state) => state.trackedState.layers.Base);
  const untrackedState = useMapStore((state) => state.untrackedState.layers.Base);
  const setMeasurePoint = useMapStore((state) => state.baseLayerSetMeasurePoint);

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

  return (
    <Layer
      listening={
        listening &&
        untrackedState.measureStep !== 'inactive' &&
        untrackedState.measureStep !== 'both selected'
      }
      visible={visible}
      opacity={opacity}
      onClick={measurementOnClick}
    >
      {trackedState.nextcloudImagePath && (
        <NextcloudKonvaImage
          path={trackedState.nextcloudImagePath}
          onload={onload}
          rotation={trackedState.rotation ?? 0}
          scaleX={trackedState.scale / MAP_PIXELS_PER_METER}
          scaleY={trackedState.scale / MAP_PIXELS_PER_METER}
          offset={imageOffset}
          draggable={false}
        />
      )}
      <MeasurementGroup />
    </Layer>
  );
};

export default BaseLayer;
