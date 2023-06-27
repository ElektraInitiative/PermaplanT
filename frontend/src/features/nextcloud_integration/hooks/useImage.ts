import { getImage } from '../api/getImages';
import { useImageFromBlob } from './useImageFromBlob';
import { useNextcloudWebDavClient } from '@/config/nextcloud_client';
import errorImageSource from '@/icons/photo-off.svg';
import { useQuery } from '@tanstack/react-query';
import { WebDAVClient } from 'webdav';

type UseImageOptions = {
  /** relative path starting at the user's Nextcloud root directory */
  path: string;
  /** The onload callback to call when the image successfully loaded. */
  onload?: (image: HTMLImageElement) => void;
  /** The fallback image source to use if the image is not loaded yet, or if there was an error. */
  fallbackImageSource?: string;
};

/**
 * A hook for fetching images from the user's Nextcloud root directory.
 */
export function useImage({
  path,
  fallbackImageSource = errorImageSource,
  onload,
}: UseImageOptions) {
  const webdav = useNextcloudWebDavClient();

  const { isError, isLoading, data } = useQuery(['image', path], {
    queryFn: () => getImage(path, webdav as WebDAVClient),
    refetchOnWindowFocus: false,
    enabled: !!webdav && !!path,
  });

  const image = useImageFromBlob({
    isLoading,
    isError,
    data,
    fallbackImageSource,
    onload,
  });

  return image;
}
