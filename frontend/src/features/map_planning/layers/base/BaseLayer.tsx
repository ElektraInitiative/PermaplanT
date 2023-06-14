import { MAP_PIXELS_PER_METER } from '../../utils/Constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import Konva from 'konva';
import { useRef } from 'react';
import { Layer, Image } from 'react-konva';
import { FileStat, ResponseDataDetailed, WebDAVClient } from 'webdav';
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

interface BaseLayerProps extends Konva.LayerConfig {
  /**
   * Connection to Nextcloud.
   * Used to load the background image.
   */
  nextcloudClient: WebDAVClient;
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

/**
 * Check if a file from Nextcloud is actually an image to avoid Konva crashes.
 *
 * @param imageStat file stats returned by nextcloud.
 */
const checkFileIsImage = (
  imageStat: UseQueryResult<FileStat | ResponseDataDetailed<FileStat>, unknown>,
): boolean => {
  if (imageStat.data == undefined || imageStat.isError) return false;

  const stat = imageStat.data as FileStat;
  return stat.type === 'file' && (stat.mime?.startsWith('image') ?? false);
};

const BaseLayer = ({
  nextcloudClient,
  visible,
  opacity,
  nextcloudImagePath,
  pixelsPerMeter,
  rotation,
}: BaseLayerProps) => {
  const { t } = useTranslation(['baseLayer']);

  // It shouldn't matter whether the image path starts with a slash or not.
  let cleanImagePath = nextcloudImagePath;
  if (cleanImagePath.startsWith('/')) {
    cleanImagePath = cleanImagePath.substring(1);
  }

  const imageURLPath = `/remote.php/webdav/${cleanImagePath ?? ''}`;

  // Width and height of the background image are only set after the image is
  // rendered in the browser.
  const width = useRef(0);
  const height = useRef(0);

  // Hooks have to be called an equal number of times on each render.
  // We therefore have to check whether a file is a valid image after loading it.
  const fileStat = useQuery(['stat', imageURLPath], () =>
    nextcloudClient.stat(imageURLPath, { details: false }),
  );
  const imageData = useQuery(['files', imageURLPath], () =>
    nextcloudClient.getFileContents(imageURLPath),
  );

  if (imageData.isLoading) {
    return <Layer></Layer>;
  }

  if (imageData.isError) {
    console.log('Data undefined.', nextcloudImagePath);
    if (nextcloudImagePath != '')
      toast.error(t('baseLayer:loadingFailed'));
    return <Layer></Layer>;
  }

  if (!checkFileIsImage(fileStat)) {
    console.log('Not an image', nextcloudImagePath);
    if (nextcloudImagePath != '')
      toast.error(t('baseLayer:notAnImage'));
    return <Layer></Layer>;
  }



  const image = new window.Image();
  image.src = URL.createObjectURL(new Blob([imageData.data as BlobPart]));
  // Set width and height after the browser has finished loading the image.
  image.onload = () => {
    width.current = image.naturalWidth;
    height.current = image.naturalHeight;
  };

  const scale = pixelsPerMeter / MAP_PIXELS_PER_METER;

  return (
    <Layer listening={false} visible={visible} opacity={opacity} offset={{ x: -width, y: -height }}>
      <Image
        image={image}
        rotation={rotation}
        scaleX={scale}
        scaleY={scale}
        offset={{ x: width.current / 2, y: height.current / 2 }}
      />
    </Layer>
  );
};

export default BaseLayer;
