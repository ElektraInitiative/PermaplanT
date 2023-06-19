import { Image } from 'react-konva';
import { useTranslation } from 'react-i18next';
import { createNextcloudWebDavClient } from '@/config/nextcloud_client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import loadingImageUrl from '@/assets/loading_image.jpg'
import errorImageUrl from '@/assets/broken_image.png'
import { ShapeConfig } from 'konva/lib/Shape';
import { IRect } from 'konva/lib/types';

interface NextcloudKonvaImageProps extends ShapeConfig {
  // relative path starting at the users Nextcloud root directory
  path: string
  crop?: IRect;
  cornerRadius?: number | number[];
  onWidthChange?: (width: number) => void
  onHeightChange?: (height: number) => void
  onload?: (ncImage: HTMLImageElement) => void;
}

const WEBDAV_PATH = '/remote.php/webdav/';
export const NextcloudKonvaImage = (props: NextcloudKonvaImageProps) => {
  const { t } = useTranslation(['nextcloudIntegration']);
  const { path, onWidthChange, onHeightChange, ...imageProps } = props;
  const webdav = createNextcloudWebDavClient();

  const imagePath = WEBDAV_PATH + path;
  const {
    data,
    isLoading,
    isError,
  } = useQuery(['image', WEBDAV_PATH + path], () => webdav.getFileContents(imagePath));

  // if (isLoading) {
  //   const loadingImage = new window.Image();
  //   loadingImage.src = loadingImageUrl
  //   console.log("background loading image")
  //   console.log(loadingImage)
  //   return <Image image={loadingImage} />
  // }

  if (isError) {
    toast.error(t('nextcloudIntegration:load_image_failed'));
    // const errorImage = new window.Image();
    // errorImage.src = errorImageUrl
    // image.addEventListener('load', this.handleLoad);
    // //TODO: return broken image icon
    // console.log("background error image")
    // return <Image image={errorImage} />;
  }

  const ncImage = new window.Image();
  ncImage.src = URL.createObjectURL(new Blob([data as BlobPart]));

  ncImage.onload = () => {
    if (onWidthChange) {
      console.log(ncImage.naturalWidth)
      onWidthChange(ncImage.naturalWidth)
    }
    if (onHeightChange) {
      console.log(ncImage.naturalHeight)
      onHeightChange(ncImage.naturalHeight)
    }

    if (props.onload !== undefined) props.onload(ncImage);
  };

  return <Image
    {...imageProps}
    image={ncImage}
  />
}
