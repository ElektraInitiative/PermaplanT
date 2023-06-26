import { MAP_PIXELS_PER_METER } from '../../utils/Constants';
import { NextcloudKonvaImage } from '@/features/map_planning/components/NextcloudKonvaImage';
import useMapStore from '@/features/map_planning/store/MapStore';
import Konva from 'konva';
import { useState } from 'react';
import { Layer } from 'react-konva';

const BaseLayer = ({ visible, opacity }: Konva.LayerConfig) => {
  const trackedState = useMapStore((state) => state.trackedState.layers.base);

  // Make sure that the image is centered on, and rotates around, the origin.
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

  const onload = (image: HTMLImageElement) => {
    if (imageOffset.x !== image.width / 2 || imageOffset.y !== image.height / 2)
      setImageOffset({ x: image.width / 2, y: image.height / 2 });
  };

  return (
    <Layer listening={false} visible={visible} opacity={opacity}>
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
    </Layer>
  );
};

export default BaseLayer;
