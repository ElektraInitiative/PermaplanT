import { createNextcloudAPI } from '@/config/axios';

// NOTE: Leaving this for now as it could be useful as an exmample
// when fetching ressources from other parts of Nextcloud
/**
 * @deprecated This is done by the webdav lib now
 * get list of available images at the given path from Nextcloud
 * @param path: Nextcloud path to target directory e.g. (Photos)
 */
export const getImageList = async (path: string): Promise<Array<string>> => {
  const http = createNextcloudAPI();
  try {
    const response = await http({
      method: 'PROPFIND',
      url: '/remote.php/webdav/' + path,
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

// NOTE: Leaving this for now as it could be useful as an exmample
// when fetching ressources from other parts of Nextcloud
/**
 * @deprecated This is done by the webdav lib now
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
