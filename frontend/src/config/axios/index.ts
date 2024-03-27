import axios from 'axios';
import { getUser } from '@/utils/getUser';
import mapErrorToString from '@/utils/map-error-to-string';
import { baseApiUrl, nextcloudUri } from '../env';

/**
 * create an instance of axios configured for PermaplanT
 * the configuration includes the baseUrl
 */
export function createUnauthorizedAPI() {
  const http = axios.create({
    baseURL: baseApiUrl,
    timeout: 3000,
  });
  return http;
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

// Intercept the axios response to map errors messages to more sensible messages.
axios.interceptors.response.use(
  (r) => r,
  (error: Error) => {
    console.error(error);

    error.message = mapErrorToString(error);

    return Promise.reject(error);
  },
);
