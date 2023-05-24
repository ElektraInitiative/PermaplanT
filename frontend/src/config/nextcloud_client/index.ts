import { User } from 'oidc-client-ts';
import { createClient } from "webdav";

/**
 * create an instance of axios configured for the PermaplanT Nextcloud instance
 * the configuration includes the baseUrl and authorization token if available
 */
export function createNextcloudWebDavClient() {
  const user = getUser();

  return http;
}
