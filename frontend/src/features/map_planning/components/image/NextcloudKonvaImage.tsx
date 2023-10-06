import { useImage } from '@/features/nextcloud_integration/hooks/useImage';
import defaultImageUrl from '@public/plant.svg';
import { ImageConfig } from 'konva/lib/shapes/Image';
import { Image } from 'react-konva';

interface NextcloudKonvaImageProps extends Omit<ImageConfig, 'image'> {
  /** relative path starting at the users Nextcloud root directory */
  path: string;
  /** Fires immediately after the browser loads the image object. */
  onload?: (ncImage: HTMLImageElement) => void;
}

/**
 * Loads an image from Nextcloud and renders a Konva.Image shape on success.
 * renders a default image on failure or while loading.
 * @param props.path relative path starting at the users Nextcloud root directory
 * @param props.onload Fires immediately after the browser loads the image object.
 **/
export const NextcloudKonvaImage = (props: NextcloudKonvaImageProps) => {
  const { path, ...imageProps } = props;
  const { onload } = props;

  const image = useImage({
    path,
    onload,
    fallbackImageSource: defaultImageUrl,
  });

  return <Image {...imageProps} image={image} />;
};
