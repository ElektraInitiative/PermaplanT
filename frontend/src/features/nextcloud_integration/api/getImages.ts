import { createNextcloudAPI } from '@/config/axios';

/**
 * get list of available images int the directory 'Photos' from Nextcloud
 */
export const getPhotos = async (): Promise<Array<string>> => {
  const http = createNextcloudAPI();
  try {
    const response = await http({
      method: 'PROPFIND',
      url: '/remote.php/webdav/Photos',
    });
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data, 'application/xml');
    const imageUrls: Array<string> = [];
    doc.documentElement.childNodes.forEach((value) => {
      imageUrls.push(value.childNodes[0].childNodes[0].data);
    });
    return imageUrls;
  } catch (error) {
    throw error as Error;
  }
};

/**
 * get an Image as a blob from Nextcloud
 */
export const getImage = async (imageUrl: string): Promise<Blob> => {
  const http = createNextcloudAPI();
  try {
    const response = await http({
      method: 'GET',
      url: imageUrl,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
