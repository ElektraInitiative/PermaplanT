import { baseApiUrl, authority, client_id, nextcloudUri } from '@/config';
import axios from 'axios';
import { User } from 'oidc-client-ts';

function getUser() {
  const oidcStorage = sessionStorage.getItem(`oidc.user:${authority}:${client_id}`);
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}
/**
 * create an instance of axios configured for PermaplanT
 * the configuration includes the baseUrl and authorization token if available
 */
export function createAPI() {
  const user = getUser();
  const http = axios.create({
    baseURL: baseApiUrl,
    timeout: 3000,
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
  return http;
}

/**
 * create an instance of axios configured for the PermaplanT Nextcloud instance
 * the configuration includes the baseUrl and authorization token if available
 */
export function createNextcloudAPI() {
  const user = getUser();
  const http = axios.create({
    baseURL: nextcloudUri,
    timeout: 3000,
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
  return http;
}
