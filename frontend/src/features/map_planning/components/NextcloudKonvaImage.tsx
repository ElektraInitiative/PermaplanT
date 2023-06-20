import defaultImageUrl from '@/assets/plant.svg';
import { createNextcloudWebDavClient } from '@/config/nextcloud_client';
import { useQuery } from '@tanstack/react-query';
import { ShapeConfig } from 'konva/lib/Shape';
import { IRect } from 'konva/lib/types';
import { useTranslation } from 'react-i18next';
import { Image, Rect } from 'react-konva';
import { toast } from 'react-toastify';
import { FileStat, ResponseDataDetailed } from 'webdav';
import { WebDAVClient } from 'webdav';

interface NextcloudKonvaImageProps extends ShapeConfig {
  /** relative path starting at the users Nextcloud root directory */
  path?: string;
  /** crop the image with given rectangle */
  crop?: IRect;
  /** corner radius of the image */
  cornerRadius?: number | number[];
  /** Fires immediately after the browser loads the image object. */
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

/** loads an image from Nextcloud and returns a KonvaImage shape on success.
 * When no path is given a default image is returned.
 * @param props.path relative path starting at the users Nextcloud root directory
 * @param props.crop crop the image with given rectangle
 * @param props.cornerRadius corner radius of the image
 * @param props.onload Fires immediately after the browser loads the image object.
 * @returns a KonvaNodeComponent which is either the requested image or a rectangle of size 0 in case an error occurs
 **/
export const NextcloudKonvaImage = (props: NextcloudKonvaImageProps) => {
  const { t } = useTranslation(['nextcloudIntegration']);
  const { path, ...imageProps } = props;
  let webdav: WebDAVClient | undefined;
  try {
    webdav = createNextcloudWebDavClient();
  } catch (error) {
    console.error(error);
  }

  const imagePath = WEBDAV_PATH + path;
  const { data, isLoading, isError, error } = useQuery(['image', WEBDAV_PATH + path], () =>
    webdav ? webdav.getFileContents(imagePath) : '',
  );

  // Hooks have to be called an equal number of times on each render.
  // We therefore have to check whether a file is a valid image after loading it.
  const fileIsImage = useQuery(['stat', imagePath], () =>
    webdav
      ? webdav.stat(imagePath, { details: false }).then((stat) => checkFileIsImage(stat))
      : false,
  );

  if (path) {
    if (isLoading) {
      return <Rect width={0} height={0} />;
    }

    if (isError || !fileIsImage) {
      toast.error(t('nextcloudIntegration:load_image_failed') + error);
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
  } else {
    const defaultImage = new window.Image();
    defaultImage.src = defaultImageUrl;
    return <Image {...imageProps} image={defaultImage} />;
  }
};
