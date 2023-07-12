import { getPublicImage } from '@/features/nextcloud_integration/api/getImages';
import { useImageFromBlob } from '@/features/nextcloud_integration/hooks/useImageFromBlob';
import errorImageSource from '@/icons/photo-off.svg';
import { useQuery } from '@tanstack/react-query';

type UsePublicImageOptions = {
  /** Relative path starting at the public share directory to the image in Nextcloud. */
  path: string;
  /** token which identifies the public share directory. */
  publicShareToken: string;
  /** The onload callback to call when the image successfully loaded. */
  onload?: (image: HTMLImageElement) => void;
  /** The fallback image source to use if the image is not loaded yet, or if there was an error. */
  fallbackImageSource?: string;
};

/**
 * A hook for fetching and displaying images from Nextcloud public share directories.
 */
export function usePublicImage({
  path,
  publicShareToken,
  fallbackImageSource = errorImageSource,
  onload,
}: UsePublicImageOptions) {
  const { isError, isLoading, data } = useQuery(['image', path], {
    queryFn: () => getPublicImage(path, publicShareToken),
    refetchOnWindowFocus: false,
    // We don't want to refetch the image, because the path is not changing.
    staleTime: Infinity,
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
