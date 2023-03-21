import mapErrorToString from '@/utils/map-error-to-string';
import axios from 'axios';

// Intercept the axios response to map errors messages to more sensible messages.
axios.interceptors.response.use(
  (r) => r,
  (error) => {
    console.error(error);

    if (error instanceof Error) {
      error.message = mapErrorToString(error);
    }

    return Promise.reject(error);
  },
);

export const baseApiUrl = 'http://localhost:8080';
