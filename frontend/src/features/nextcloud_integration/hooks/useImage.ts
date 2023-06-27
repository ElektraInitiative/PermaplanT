import { getImage } from '../api/getImages';
import { useImageFromBlob } from './useImageFromBlob';
import { useNextcloudWebDavClient } from '@/config/nextcloud_client';
import errorImageSource from '@/icons/photo-off.svg';
import { useQuery } from '@tanstack/react-query';
import { WebDAVClient } from 'webdav';

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
