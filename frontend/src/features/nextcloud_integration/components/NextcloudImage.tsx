import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { createNextcloudWebDavClient } from '@/config/nextcloud_client';
import { ImageBlob } from '@/features/nextcloud_integration/components/ImageBlob';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const WEBDAV_PATH = '/remote.php/webdav/';

/**
 * Component used for fetching and displaying images from private Nextcloud directories
 */
interface NextcloudImageProps extends React.ComponentPropsWithoutRef<'img'> {
  /** relative path starting at the users Nextcloud root directory */
  path: string;
}

export const NextcloudImage = (props: NextcloudImageProps) => {
  const { t } = useTranslation(['nextcloudIntegration']);
  const { path, ...imageProps } = props;
  const webdav = createNextcloudWebDavClient();

  const imagePath = WEBDAV_PATH + path;
  const {
    data: image,
    isLoading,
    isError,
  } = useQuery(['image', WEBDAV_PATH + path], () => webdav.getFileContents(imagePath));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    toast.error(t('nextcloudIntegration:load_image_failed'));
    //TODO: return broken image icon
    return <div></div>;
  }

  return <ImageBlob image={new Blob([image as BlobPart])} {...imageProps}></ImageBlob>;
};
