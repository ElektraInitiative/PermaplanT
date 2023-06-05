import { MAP_PIXELS_PER_METER } from '../utils/Constants';
import { useQuery } from '@tanstack/react-query';
import { Layer, Image } from 'react-konva';
import { FileStat, WebDAVClient } from 'webdav';

interface BaseLayerProps {
  nextcloudClient: WebDAVClient;
  nextcloudImagePath: string;
  opacity: number;
  visible: boolean;
  pixels_per_meter: number;
  rotation: number;
}

const checkFileIsImage = (path: string, client: WebDAVClient): boolean => {
  const { data, isError } = useQuery(['stat', path], () => client.stat(path, { details: false }));
  if (data == undefined || isError) return false;

  const stat = data as FileStat;
  return stat.type === 'file' && (stat.mime?.startsWith('image') ?? false);
};

const BaseLayer = ({
  nextcloudClient,
  visible,
  opacity,
  nextcloudImagePath,
  pixels_per_meter,
  rotation,
}: BaseLayerProps) => {
  const imagepath = `/remote.php/webdav/${nextcloudImagePath ?? ''}`;

  const { data } = useQuery(['files', imagepath], () => nextcloudClient.getFileContents(imagepath));
  if (!checkFileIsImage(imagepath, nextcloudClient)) return <Layer></Layer>;

  const image = new window.Image();
  image.src = URL.createObjectURL(new Blob([data as BlobPart]));

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
