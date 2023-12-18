import { usePublicImage } from '../hooks/usePublicImage';
import { QueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type RetryValue<TError> = QueryOptions<unknown, TError>['retry'];

interface PublicNextcloudImageProps extends React.ComponentPropsWithoutRef<'img'> {
  // relative path starting at the public share directory to the image in Nextcloud
  path: string;
  // token which identifies the public share directory
  shareToken: string;
  // placeholder that will be displayed if the requested image was not found
  defaultImageUrl?: string;
  // Whether fetching the image should be retried on fail.
  retry?: RetryValue<AxiosError>;
  /** Whether an error modal should be displayed if the image can't be loaded. */
  showErrorMessage?: boolean;
}

/**
 * Component used for fetching and displaying images from Nextcloud public share directories
  @param props.path: relative path starting at the public share directory to the image in Nextcloud
  @param props.shareToken: token which identifies the public share directory
 */
export const PublicNextcloudImage = (props: PublicNextcloudImageProps) => {
  const { path, shareToken, defaultImageUrl, retry, showErrorMessage, ...imageProps } = props;

  const image = usePublicImage({
    path,
    publicShareToken: shareToken,
    fallbackImageSource: defaultImageUrl,
    retry,
    showErrorMessage,
  });

  return <img src={image.src} {...imageProps} />;
};
