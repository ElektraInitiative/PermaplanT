import { MAP_PIXELS_PER_METER } from '../../utils/Constants';
import { NextcloudKonvaImage } from '@/features/map_planning/components/NextcloudKonvaImage';
import useMapStore from '@/features/map_planning/store/MapStore';
import Konva from 'konva';
import { useState } from 'react';
import { Layer } from 'react-konva';

const BaseLayer = ({ visible, opacity }: Konva.LayerConfig) => {
  const baseLayerState = useMapStore((state) => state.trackedState.layers.base);

  // Make sure that the image is centered on, and rotates around, the origin.
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

  const onload = (image: HTMLImageElement) => {
    if (imageOffset.x !== image.width / 2 || imageOffset.y !== image.height / 2)
      setImageOffset({ x: image.width / 2, y: image.height / 2 });
  };

  return (
    <Layer listening={false} visible={visible} opacity={opacity}>
      {baseLayerState.nextcloudImagePath && (
        <NextcloudKonvaImage
          path={baseLayerState.nextcloudImagePath}
          onload={onload}
          rotation={baseLayerState.rotation ?? 0}
          scaleX={baseLayerState.scale / MAP_PIXELS_PER_METER}
          scaleY={baseLayerState.scale / MAP_PIXELS_PER_METER}
          offset={imageOffset}
          draggable={false}
        />
      )}
    </Layer>
  );
};

export default BaseLayer;
