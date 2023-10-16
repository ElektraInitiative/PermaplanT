import { getImage } from '../api/getImages';
import { useImageFromBlob } from './useImageFromBlob';
import { useNextcloudWebDavClient } from '@/config/nextcloud_client';
import errorImageSource from '@/svg/icons/photo-off.svg';
import { useQuery } from '@tanstack/react-query';
import { WebDAVClient } from 'webdav';

type UseImageOptions = {
  /** relative path starting at the user's Nextcloud root directory */
  path: string;
  /** The onload callback to call when the image successfully loaded. */
  onload?: (image: HTMLImageElement) => void;
  /** The fallback image source to use if the image is not loaded yet, or if there was an error. */
  fallbackImageSource?: string;
  /** Whether an error message should be displayed. */
  showErrorMessage?: boolean;
};

/**
 * A hook for fetching images from the user's Nextcloud root directory.
 */
export function useImage({
  path,
  fallbackImageSource = errorImageSource,
  onload,
  showErrorMessage = true,
}: UseImageOptions) {
  const webdav = useNextcloudWebDavClient();

  const { isError, isLoading, data } = useQuery(['image', path], {
    queryFn: () => getImage(path, webdav as WebDAVClient),
    refetchOnWindowFocus: false,
    enabled: !!webdav && !!path,
    // We don't want to refetch the image, because the path is not changing.
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const image = useImageFromBlob({
    isLoading,
    isError,
    data,
    fallbackImageSource,
    onload,
    showErrorMessage,
  });

  return image;
}
