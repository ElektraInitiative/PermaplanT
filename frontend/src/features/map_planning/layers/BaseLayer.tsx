import { MAP_PIXELS_PER_METER } from '../utils/Constants';
import { Layer, Image } from 'react-konva';
import { createNextcloudWebDavClient } from '@/config/nextcloud_client';
import { useQuery } from '@tanstack/react-query';
import {ImageBlob} from '../../nextcloud_integration/components/ImageBlob';

interface BaseLayerProps {
  opacity: number;
  visible: boolean;
  nextcloudImagePath: string;
  pixels_per_meter: number;
  rotation: number;
}

const BaseLayer = ({ visible, opacity, nextcloudImagePath, pixels_per_meter, rotation }: BaseLayerProps) => {
  const webdav = createNextcloudWebDavClient();
  const imagepath = `/remote.php/webdav/${nextcloudImagePath};` 
  const imageData = useQuery(['files', imagepath], () => webdav.getFileContents(imagepath));
  const image = new HTMLImageElement();
  image.src = URL.createObjectURL(new Blob([imageData?.data as BlobPart]));

  const scale = pixels_per_meter / MAP_PIXELS_PER_METER;
  const width = image?.width ?? 0;
  const height = image?.height ?? 0;
  
    return (
    <Layer listening={false} visible={visible} opacity={opacity} offset={{ x: -width, y: -height }}>
      <Image
        image={image}
        rotation={rotation}
        scaleX={scale}
        scaleY={scale}
        offset={{ x: width / 2, y: height / 2 }}
      />
    </Layer>
  );
};

export default BaseLayer;
