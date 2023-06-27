import defaultImageUrl from '@/assets/plant.svg';
import { usePublicImage } from '@/features/nextcloud_integration/hooks/usePublicImage';
import { ImageConfig } from 'konva/lib/shapes/Image';
import { Image } from 'react-konva';

interface PublicNextcloudKonvaImageProps extends Omit<ImageConfig, 'image'> {
  /** relative path starting at the public share directory to the image in Nextcloud */
  path: string;
  /** token which identifies the public share directory */
  shareToken: string;
  /** Fires immediately after the browser loads the image object. */
  onload?: (ncImage: HTMLImageElement) => void;
}

export function PublicNextcloudKonvaImage({
  path,
  shareToken,
  onload,
  ...imageProps
}: PublicNextcloudKonvaImageProps) {
  const image = usePublicImage({
    publicShareToken: shareToken,
    path,
    onload,
    fallbackImageSource: defaultImageUrl,
  });

  return <Image {...imageProps} image={image} />;
}
