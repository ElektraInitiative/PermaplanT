import { getUser } from '@/utils/getUser';
import { AuthType, createClient } from "webdav";
import { nextcloudUri } from '../env';

/**
 * create a webdav client configured for the PermaplanT Nextcloud instance
 * the configuration includes the baseUrl and authorization token if available
 */
export function createNextcloudWebDavClient() {
  const user = getUser();
  if(!user){
    throw new Error("User could not be found. Not authenticated.")
  }
  const webdav = createClient(nextcloudUri, {
      authType: AuthType.Token,
      token: {
      access_token: user?.access_token,
      token_type: user?.token_type,
      refresh_token: user?.refresh_token
    }
  });

  return webdav;
}
