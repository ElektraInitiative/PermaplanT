// Import i18n to configure it.
import './i18n';
import mapErrorToString from '@/utils/map-error-to-string';
import axios from 'axios';

export * from './env';

// Intercept the axios response to map errors messages to more sensible messages.
axios.interceptors.response.use(
  (r) => r,
  (error: Error) => {
    console.error(error);

    error.message = mapErrorToString(error);

    return Promise.reject(error);
  },
);
