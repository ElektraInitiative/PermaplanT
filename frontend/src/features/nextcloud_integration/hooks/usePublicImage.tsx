import { getPublicImage } from '@/features/nextcloud_integration/api/getImages';
import { useImageFromBlob } from '@/features/nextcloud_integration/hooks/useImageFromBlob';
import errorImageSource from '@/icons/photo-off.svg';
import { useQuery } from '@tanstack/react-query';

type UsePublicImageOptions = {
  path: string;
  publicShareToken: string;
  onload?: (image: HTMLImageElement) => void;
  fallbackImageSource?: string;
};

export function usePublicImage({
  path,
  publicShareToken,
  fallbackImageSource = errorImageSource,
  onload,
}: UsePublicImageOptions) {
  const { isError, isLoading, data } = useQuery(['image', path], {
    queryFn: () => getPublicImage(path, publicShareToken),
    refetchOnWindowFocus: false,
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
