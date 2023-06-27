import defaultImageUrl from '@/assets/plant.svg';
import { useImage } from '@/features/nextcloud_integration/hooks/useImage';
import { ImageConfig } from 'konva/lib/shapes/Image';
import { Image } from 'react-konva';

interface NextcloudKonvaImageProps extends Omit<ImageConfig, 'image'> {
  /** relative path starting at the users Nextcloud root directory */
  path: string;
  /** Fires immediately after the browser loads the image object. */
  onload?: (ncImage: HTMLImageElement) => void;
}

/** loads an image from Nextcloud and returns a KonvaImage shape on success.
 * When no path is given a default image is returned.
 * @param props.path relative path starting at the users Nextcloud root directory
 * @param props.crop crop the image with given rectangle
 * @param props.cornerRadius corner radius of the image
 * @param props.onload Fires immediately after the browser loads the image object.
 * @returns a KonvaNodeComponent which is either the requested image or a rectangle of size 0 in case an error occurs
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
