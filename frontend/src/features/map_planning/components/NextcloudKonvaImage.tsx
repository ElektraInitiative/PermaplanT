import defaultImageUrl from '@/assets/plant.svg';
import { useNextcloudWebDavClient } from '@/config/nextcloud_client';
import { useQuery } from '@tanstack/react-query';
import { ShapeConfig } from 'konva/lib/Shape';
import { IRect } from 'konva/lib/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Rect } from 'react-konva';
import { toast } from 'react-toastify';
import { FileStat, ResponseDataDetailed } from 'webdav';

interface NextcloudKonvaImageProps extends Omit<ShapeConfig, 'src'> {
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
const checkFileIsImage = (
  imageStat: FileStat | ResponseDataDetailed<FileStat> | undefined | null,
): boolean => {
  if (!imageStat) return false;

  const stat = imageStat as FileStat;
  return stat.type === 'file' && Boolean(stat.mime?.startsWith('image'));
};

const WEBDAV_PATH = '/remote.php/webdav/';

function createDefaultImage() {
  const defaultImage = new window.Image();
  defaultImage.src = defaultImageUrl;
  return defaultImage;
}

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
  const { onload } = props;

  const [image, setImage] = useState(createDefaultImage);

  const webdav = useNextcloudWebDavClient();

  const imagePath = WEBDAV_PATH + path;
  const { data, isLoading, isError, error } = useQuery(['image', imagePath, path, webdav], {
    queryFn: () => {
      return webdav && path ? webdav.getFileContents(imagePath) : null;
    },
    enabled: !!webdav && !!path,
  });

  // Hooks have to be called an equal number of times on each render.
  // We therefore have to check whether a file is a valid image after loading it.
  const { data: fileStat, isLoading: isFileStatLoading } = useQuery(['stat', imagePath], {
    queryFn: async () => {
      if (!webdav) return null;
      return webdav?.stat(imagePath, { details: false });
    },
    enabled: !!webdav && !!path,
  });

  const imageLoadedSuccessfully =
    Boolean(data) && !isError && !isLoading && !isFileStatLoading && checkFileIsImage(fileStat);

  useEffect(() => {
    if (!imageLoadedSuccessfully) {
      setImage(createDefaultImage);
      return;
    }

    const blob = new Blob([data as BlobPart]);
    const objectUrl = URL.createObjectURL(blob);

    const newImage = new window.Image();
    newImage.src = objectUrl;
    newImage.onload = () => {
      onload?.(newImage);
    };
    setImage(newImage);

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [data, onload, imageLoadedSuccessfully]);

  if (path) {
    if (isLoading) {
      return <Rect width={0} height={0} />;
    }

    if (isError || (Boolean(data) && Boolean(fileStat) && !checkFileIsImage(fileStat))) {
      toast.error(t('nextcloudIntegration:load_image_failed') + error);
      // When the image cannot be retrieved the component returns a Rectangle shape with a width and height of 0
      // The rationale is that the konva layer always gets a shape and doesn't produce errors
      return <Rect width={0} height={0} />;
    }
  }

  return <Image {...imageProps} image={image} />;
};
