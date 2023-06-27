import { useNextcloudWebDavClient } from '@/config/nextcloud_client';
import errorImageSource from '@/icons/photo-off.svg';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FileStat, ResponseDataDetailed } from 'webdav';

const WEBDAV_PATH = '/remote.php/webdav/';

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

function createImage(src: string) {
  const newImage = new window.Image();
  newImage.src = src;
  return newImage;
}

type UseImageOptions = {
  path: string;
  onload?: (image: HTMLImageElement) => void;
  fallbackImageSource?: string;
};

export function useImage({
  path,
  fallbackImageSource = errorImageSource,
  onload,
}: UseImageOptions) {
  const [image, setImage] = useState(createImage(fallbackImageSource));
  const webdav = useNextcloudWebDavClient();

  const imagePath = WEBDAV_PATH + path;
  const query = useQuery(['image', imagePath], {
    queryFn: () => {
      return webdav?.getFileContents(imagePath) ?? null;
    },
    refetchOnWindowFocus: false,
    enabled: !!webdav && !!path,
  });

  const fileStatQuery = useQuery(['stat', imagePath], {
    queryFn: async () => {
      return webdav?.stat(imagePath, { details: false }) ?? null;
    },
    refetchOnWindowFocus: false,
    enabled: !!webdav && !!path,
  });

  const isLoading = query.isLoading || fileStatQuery.isLoading;
  const isError =
    query.isError ||
    fileStatQuery.isError ||
    (fileStatQuery.data && !checkFileIsImage(fileStatQuery.data));

  const { data: imageData } = query;

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }

    const blob = new Blob([imageData as BlobPart]);
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
  }, [imageData, onload, fallbackImageSource, isLoading, isError]);

  console.log('image', image);

  return image;
}
