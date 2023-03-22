import mapErrorToString from '@/utils/map-error-to-string';
import axios from 'axios';

// Intercept the axios response to map errors messages to more sensible messages.
axios.interceptors.response.use(
  (r) => r,
  (error: Error) => {
    console.error(error);

    error.message = mapErrorToString(error);

    return Promise.reject(error);
  },
);
if (!import.meta.env.VITE_BASE_API_URL) {
  throw 'VITE_BASE_API_URL no set';
}

export const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
