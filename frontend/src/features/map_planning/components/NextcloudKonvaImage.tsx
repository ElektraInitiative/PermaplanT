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
  // crop the image with given rectangle
  crop?: IRect;
  // corner radius of the image
  cornerRadius?: number | number[];
  // Fires immediately after the browser loads the image object.
  onload?: (ncImage: HTMLImageElement) => void;
}

const WEBDAV_PATH = '/remote.php/webdav/';


/** loads an image from Nextcloud and returns a KonvaImage shape on success
  * @param props.path relative path starting at the users Nextcloud root directory
  * @param props.crop crop the image with given rectangle
  * @param props.cornerRadius corner radius of the image
  * @param props.onload Fires immediately after the browser loads the image object.
  * @returns a KonvaNodeComponent which is either the requested image or a rectangle of size 0 in case an error occurs
  **/
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
    // When the image cannot be retrieved the component returns a Rectangle shape with a width and height of 0
    // The rationale is that the konva layer always gets a shape and doesn't produce errors
    return <Rect width={0} height={0} />;
  }

  const ncImage = new window.Image();
  ncImage.src = URL.createObjectURL(new Blob([data as BlobPart]));

  ncImage.onload = () => {
    if (props.onload) props.onload(ncImage);
  };

  return <Image {...imageProps} image={ncImage} />;
};
