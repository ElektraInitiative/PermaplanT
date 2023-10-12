import { getPublicImage } from '@/features/nextcloud_integration/api/getImages';
import { useImageFromBlob } from '@/features/nextcloud_integration/hooks/useImageFromBlob';
import errorImageSource from '@/svg/icons/photo-off.svg';
import { RetryValue } from '@tanstack/query-core/build/lib/retryer';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type UsePublicImageOptions = {
  /** Relative path starting at the public share directory to the image in Nextcloud. */
  path: string;
  /** token which identifies the public share directory. */
  publicShareToken: string;
  /** The onload callback to call when the image successfully loaded. */
  onload?: (image: HTMLImageElement) => void;
  /** The fallback image source to use if the image is not loaded yet, or if there was an error. */
  fallbackImageSource?: string;
  /** Whether an error modal should be displayed if the image can't be loaded. */
  showErrorMessage?: boolean;
  // Whether fetching the image should be retried on fail.
  retry?: RetryValue<AxiosError>;
};

/**
 * A hook for fetching and displaying images from Nextcloud public share directories.
 */
export function usePublicImage({
  path,
  publicShareToken,
  fallbackImageSource = errorImageSource,
  onload,
  showErrorMessage = true,
  retry,
}: UsePublicImageOptions) {
  const queryFn = () => getPublicImage(path, publicShareToken);

  const { isError, isLoading, data } = useQuery(['image', path, retry], {
    // We don't want to refetch the image, because the path is not changing.
    queryFn,
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry,
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
