import { MAP_PIXELS_PER_METER } from '../../utils/Constants';
import { NextcloudKonvaImage } from '@/features/map_planning/components/NextcloudKonvaImage';
import Konva from 'konva';
import { useCallback, useState } from 'react';
import { Layer } from 'react-konva';

interface BaseLayerProps extends Konva.LayerConfig {
  /**
   * Filepath to the background image in Nextcloud.
   */
  nextcloudImagePath: string;
  /**
   * Used to align the size of the background image with the real world.
   */
  pixelsPerMeter: number;
  /**
   * The amount of rotation required to align the base layer with geographic north.
   */
  rotation: number;
}

const BaseLayer = ({
  visible,
  opacity,
  nextcloudImagePath,
  pixelsPerMeter,
  rotation,
}: BaseLayerProps) => {
  // It shouldn't matter whether the image path starts with a slash or not.
  let cleanImagePath = nextcloudImagePath;
  if (cleanImagePath.startsWith('/')) {
    cleanImagePath = cleanImagePath.substring(1);
  }

  // Make sure that the image is centered on, and rotates around, the origin.
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

  const onload = useCallback((image: HTMLImageElement) => {
    setImageOffset({ x: image.width / 2, y: image.height / 2 });
  }, []);

  const scale = pixelsPerMeter / MAP_PIXELS_PER_METER;

  return (
    <Layer listening={false} visible={visible} opacity={opacity}>
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
    </Layer>
  );
};

export default BaseLayer;
