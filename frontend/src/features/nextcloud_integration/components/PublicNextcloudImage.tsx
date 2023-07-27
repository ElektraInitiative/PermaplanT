import { usePublicImage } from '../hooks/usePublicImage';

interface PublicNextcloudImageProps extends React.ComponentPropsWithoutRef<'img'> {
  // relative path starting at the public share directory to the image in Nextcloud
  path: string;
  // token which identifies the public share directory
  shareToken: string;
  // placeholder that will be displayed if the requested image was not found
  defaultImageUrl?: string;
}

/**
 * Component used for fetching and displaying images from Nextcloud public share directories
  @param props.path: relative path starting at the public share directory to the image in Nextcloud
  @param props.shareToken: token which identifies the public share directory
 */
export const PublicNextcloudImage = (props: PublicNextcloudImageProps) => {
  const { path, shareToken, defaultImageUrl, ...imageProps } = props;

  const image = usePublicImage({
    path,
    publicShareToken: shareToken,
    fallbackImageSource: defaultImageUrl,
  });

  return <img src={image.src} {...imageProps} />;
};
