import { useImage } from '../hooks/useImage';
import photoOffUrl from '@/svg/icons/photo-off.svg';

/**
 * Component used for fetching and displaying images from private Nextcloud directories
 */
interface NextcloudImageProps extends React.ComponentPropsWithoutRef<'img'> {
  /** relative path starting at the users Nextcloud root directory */
  path: string;
}

export const NextcloudImage = (props: NextcloudImageProps) => {
  const { path, ...imageProps } = props;

  const image = useImage({
    path,
    fallbackImageSource: photoOffUrl,
  });

  return <img {...imageProps} src={image.src} />;
};
