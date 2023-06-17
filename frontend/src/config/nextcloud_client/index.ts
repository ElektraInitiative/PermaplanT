import { nextcloudUri } from '../env';
import { getUser } from '@/utils/getUser';
import { AuthType, createClient } from 'webdav';

/**
 * create a webdav client configured for the PermaplanT Nextcloud instance
 * the configuration includes the baseUrl and authorization token if available
 */
export function createNextcloudWebDavClient() {
  const user = getUser();
  if (!user) {
    throw new Error('User could not be found. Not authenticated.');
  }

  // TODO: remove after debugging Nextcloud issues
  console.log('Nextcloud URI: ', nextcloudUri);

  const webdav = createClient(nextcloudUri, {
    authType: AuthType.Token,
    token: {
      access_token: user?.access_token,
      token_type: user?.token_type,
      refresh_token: user?.refresh_token,
    },
  });

  return webdav;
}
