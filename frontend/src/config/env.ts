if (typeof import.meta.env.VITE_BASE_API_URL !== 'string') {
  throw new Error('VITE_BASE_API_URL not set');
}
if (typeof import.meta.env.VITE_AUTHORITY !== 'string') {
  throw new Error('VITE_AUTHORITY not set');
}
if (typeof import.meta.env.VITE_CLIENT_ID !== 'string') {
  throw new Error('VITE_CLIENT_ID not set');
}
if (typeof import.meta.env.VITE_REDIRECT_URI !== 'string') {
  throw new Error('VITE_REDIRECT_URI not set');
}

export const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

export const nextcloudUri = import.meta.env.VITE_NEXTCLOUD_URI;

export const authority = import.meta.env.VITE_AUTHORITY;
export const client_id = import.meta.env.VITE_CLIENT_ID;
export const redirect_uri = import.meta.env.VITE_REDIRECT_URI;

export const isDev = import.meta.env.DEV;
export const isProd = import.meta.env.PROD;
