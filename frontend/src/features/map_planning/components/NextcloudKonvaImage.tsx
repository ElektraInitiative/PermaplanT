import { createNextcloudWebDavClient } from '@/config/nextcloud_client';
import { useQuery } from '@tanstack/react-query';
import { ShapeConfig } from 'konva/lib/Shape';
import { IRect } from 'konva/lib/types';
import { useTranslation } from 'react-i18next';
import { Image, Rect } from 'react-konva';
import { toast } from 'react-toastify';
import { FileStat, ResponseDataDetailed } from 'webdav';

interface NextcloudKonvaImageProps extends ShapeConfig {
  // relative path starting at the users Nextcloud root directory
  path: string;
  crop?: IRect;
  cornerRadius?: number | number[];
  onload?: (ncImage: HTMLImageElement) => void;
}

/**
 * Check if a file from Nextcloud is actually an image to avoid Konva crashes.
 *
 * @param imageStat file stats returned by nextcloud.
 */
const checkFileIsImage = (imageStat: FileStat | ResponseDataDetailed<FileStat>): boolean => {
  if (imageStat == undefined) return false;

  const stat = imageStat as FileStat;
  return stat.type === 'file' && (stat.mime?.startsWith('image') ?? false);
};

const WEBDAV_PATH = '/remote.php/webdav/';
export const NextcloudKonvaImage = (props: NextcloudKonvaImageProps) => {
  const { t } = useTranslation(['nextcloudIntegration']);
  const { path, ...imageProps } = props;
  const webdav = createNextcloudWebDavClient();

  const imagePath = WEBDAV_PATH + path;
  const { data, isLoading, isError } = useQuery(['image', WEBDAV_PATH + path], () =>
    webdav.getFileContents(imagePath),
  );

  // Hooks have to be called an equal number of times on each render.
  // We therefore have to check whether a file is a valid image after loading it.
  const fileIsImage = useQuery(['stat', imagePath], () =>
    webdav.stat(imagePath, { details: false }).then((stat) => checkFileIsImage(stat)),
  );

  if (isLoading) {
    return <Rect width={0} height={0} />;
  }

  if (isError || !fileIsImage) {
    toast.error(t('nextcloudIntegration:load_image_failed'));
    return <Rect width={0} height={0} />;
  }

  const ncImage = new window.Image();
  ncImage.src = URL.createObjectURL(new Blob([data as BlobPart]));

  ncImage.onload = () => {
    if (props.onload !== undefined) props.onload(ncImage);
  };

  return <Image {...imageProps} image={ncImage} />;
};
