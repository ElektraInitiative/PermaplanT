import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { getPublicImage } from '@/features/nextcloud_integration/api/getImages';
import { ImageBlob } from '@/features/nextcloud_integration/components/ImageBlob';
import { useQuery } from '@tanstack/react-query';
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const WEBDAV_PATH = '/public.php/webdav/';

interface PublicNextcloudImageProps
  extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  // relative path starting at the public share directory to the image in Nextcloud
  path: string;
  // token which identifies the public share directory
  shareToken: string;
}

/**
 * Component used for fetching and displaying images from Nextcloud public share directories
  @param props.path: relative path starting at the public share directory to the image in Nextcloud
  @param props.shareToken: token which identifies the public share directory
 */
export const PublicNextcloudImage = (props: PublicNextcloudImageProps) => {
  const { path, shareToken, ...imageProps } = props;
  const { t } = useTranslation(['nextcloudIntegration']);

  const imagePath = WEBDAV_PATH + path;
  const {
    data: image,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['image', imagePath, shareToken] as const,
    queryFn: ({ queryKey: [, imagePath, token] }) => getPublicImage(imagePath, token),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    toast.error(t('nextcloudIntegration:load_image_failed'));
    //TODO: return broken image icon
    return <div></div>;
  }

  return <ImageBlob image={image} {...imageProps}></ImageBlob>;
};
