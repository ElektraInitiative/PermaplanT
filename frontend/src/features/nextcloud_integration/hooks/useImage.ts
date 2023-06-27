import { useNextcloudWebDavClient } from '@/config/nextcloud_client';
import errorImageSource from '@/icons/photo-off.svg';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FileStat, ResponseDataDetailed, WebDAVClient } from 'webdav';

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

async function getImage(path: string, webdavClient: WebDAVClient) {
  const imagePath = WEBDAV_PATH + path;

  const tasks = [
    webdavClient.getFileContents(imagePath),
    webdavClient.stat(imagePath, { details: false }),
  ] as const;

  const [contents, stats] = await Promise.all(tasks);

  if (!checkFileIsImage(stats)) {
    throw new Error('File is not an image');
  }

  return new Blob([contents as BlobPart]);
}

export function useImage({
  path,
  fallbackImageSource = errorImageSource,
  onload,
}: UseImageOptions) {
  const [image, setImage] = useState(createImage(fallbackImageSource));
  const webdav = useNextcloudWebDavClient();

  const imagePath = WEBDAV_PATH + path;
  const { isError, isLoading, data } = useQuery(['image', imagePath], {
    queryFn: () => getImage(path, webdav as WebDAVClient),
    refetchOnWindowFocus: false,
    enabled: !!webdav && !!path,
  });

  useEffect(() => {
    if (isLoading || isError) {
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
  }, [data, onload, fallbackImageSource, isLoading, isError]);

  console.log('image', image);

  return image;
}
