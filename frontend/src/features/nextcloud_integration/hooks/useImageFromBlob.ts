/**
 * Internal API to get an image from a blob
 */
import { useEffect, useState } from 'react';

type UseImageFromBlobOptions = {
  fallbackImageSource: string;
  onload?: (image: HTMLImageElement) => void;
  isLoading: boolean;
  isError: boolean;
  data: Blob | undefined;
};

export function useImageFromBlob({
  isLoading,
  isError,
  data,
  fallbackImageSource,
  onload,
}: UseImageFromBlobOptions) {
  const [image, setImage] = useState(createImage(fallbackImageSource));

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
  }, [data, onload, isLoading, isError]);

  return image;
}

function createImage(src: string) {
  const newImage = new window.Image();
  newImage.src = src;
  return newImage;
}
