import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { useNextcloudWebDavClient } from '@/config/nextcloud_client';
import { ImageBlob } from '@/features/nextcloud_integration/components/ImageBlob';
import { ReactComponent as PhotoOffIcon } from '@/icons/photo-off.svg';
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
  const webdav = useNextcloudWebDavClient();

  const imagePath = WEBDAV_PATH + path;
  const {
    data: image,
    isLoading,
    isError,
  } = useQuery(['image', WEBDAV_PATH + path], {
    queryFn: () => {
      if (!webdav) return null;
      return webdav.getFileContents(imagePath);
    },
    enabled: !!webdav,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    toast.error(t('nextcloudIntegration:load_image_failed'));
    return <PhotoOffIcon />;
  }
  console.log(image);
  return image ? (
    <ImageBlob image={new Blob([image as BlobPart])} {...imageProps}></ImageBlob>
  ) : (
    <PhotoOffIcon />
  );
};
