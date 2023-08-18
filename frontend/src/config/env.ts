if (typeof import.meta.env.VITE_BASE_API_URL !== 'string') {
  throw new Error('VITE_BASE_API_URL not set');
}
export const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

export const nextcloudUri = import.meta.env.VITE_NEXTCLOUD_URI;

export const isDev = import.meta.env.DEV;
export const isProd = import.meta.env.PROD;
