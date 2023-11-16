import { useNextcloudWebDavClient } from '@/config/nextcloud_client';
import { getImage } from '@/features/nextcloud_integration/api/getImages';
import { useQuery } from '@tanstack/react-query';
import { WebDAVClient } from 'webdav';

/**
 * Checks if a file exists in Nextcloud.
 * @param path Nextcloud path to file in question.
 */
export function useFileExists(path: string) {
  const webdav = useNextcloudWebDavClient();

  const { isError, isLoading } = useQuery(['webdav', path], {
    queryFn: () => getImage(path, webdav as WebDAVClient),
    refetchOnWindowFocus: false,
    enabled: !!webdav && !!path,
    // We don't want to refetch the image, because the path is not changing.
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  return { isLoading, exists: !isError };
}
