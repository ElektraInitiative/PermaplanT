import { createNextcloudWebDavClient } from '@/config/nextcloud_client';
import { useQuery } from '@tanstack/react-query';
import { ShapeConfig } from 'konva/lib/Shape';
import { IRect } from 'konva/lib/types';
import { useTranslation } from 'react-i18next';
import { Image, Rect } from 'react-konva';
import { toast } from 'react-toastify';

interface NextcloudKonvaImageProps extends ShapeConfig {
  // relative path starting at the users Nextcloud root directory
  path: string;
  crop?: IRect;
  cornerRadius?: number | number[];
  onload?: (ncImage: HTMLImageElement) => void;
}

const WEBDAV_PATH = '/remote.php/webdav/';
export const NextcloudKonvaImage = (props: NextcloudKonvaImageProps) => {
  const { t } = useTranslation(['nextcloudIntegration']);
  const { path, ...imageProps } = props;
  const webdav = createNextcloudWebDavClient();

  const imagePath = WEBDAV_PATH + path;
  const { data, isLoading, isError } = useQuery(['image', WEBDAV_PATH + path], () =>
    webdav.getFileContents(imagePath),
  );

  if (isLoading) {
    return <Rect width={0} height={0} />;
  }

  if (isError) {
    toast.error(t('nextcloudIntegration:load_image_failed'));
    // const errorImage = new window.Image();
    // errorImage.src = errorImageUrl
    // image.addEventListener('load', this.handleLoad);
    // //TODO: return broken image icon
    // console.log("background error image")
    return <Rect width={0} height={0} />;
  }

  const ncImage = new window.Image();
  ncImage.src = URL.createObjectURL(new Blob([data as BlobPart]));

  ncImage.onload = () => {
    if (props.onload !== undefined) props.onload(ncImage);
  };

  return <Image {...imageProps} image={ncImage} />;
};
