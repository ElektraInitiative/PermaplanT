import { nextcloudUri } from '@/config';
import { createNextcloudAPI } from '@/config/axios';
import axios from 'axios';
import { FileStat, ResponseDataDetailed, WebDAVClient } from 'webdav';

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
      imageUrls.push(value.childNodes[0].childNodes[0].nodeValue ?? '');
    });
    return imageUrls;
  } catch (error) {
    throw error as Error;
  }
};

/**
 * get list of available images at the public share path from our Nextcloud
 */
export const getPublicImageList = async (publicShareToken: string): Promise<Array<string>> => {
  const username = publicShareToken;
  const password = publicShareToken;
  try {
    const response = await axios({
      method: 'PROPFIND',
      url: 'https://cloud.permaplant.net/public.php/webdav',
      headers: {
        Authorization: 'Basic ' + btoa(username + ':' + password),
      },
    });
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data, 'application/xml');

    const nsResolver = doc.createNSResolver(doc.documentElement);

    const result = doc.evaluate(
      '//d:response[d:propstat/d:prop/d:getcontenttype[contains(text(), "image")]]/d:href/text()',
      doc,
      nsResolver,
      XPathResult.ANY_TYPE,
      null,
    );

    const urls = [];
    let node: Node | null;
    while ((node = result.iterateNext())) {
      if (node && node.nodeValue) {
        //remove prefix '/public.php/webdav/'
        const url = node.nodeValue.replace('/public.php/webdav/', '');
        urls.push(url);
      }
    }

    return urls;
    da;
  } catch (error) {
    throw error as Error;
  }
};

const PUBLIC_WEBDAV_PATH = '/public.php/webdav/';

/**
 * get an Image as a blob from public Nextcloud share
 */
export const getPublicImage = async (path: string, publicShareToken: string): Promise<Blob> => {
  const username = publicShareToken;
  const password = publicShareToken;
  try {
    const response = await axios({
      method: 'GET',
      url: nextcloudUri + PUBLIC_WEBDAV_PATH + path,
      headers: {
        Authorization: 'Basic ' + btoa(username + ':' + password),
      },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};

const WEBDAV_PATH = '/remote.php/webdav/';

export async function getImage(path: string, webdavClient: WebDAVClient) {
  const imagePath = WEBDAV_PATH + path;

  const tasks = [
    webdavClient.getFileContents(imagePath),
    webdavClient.stat(imagePath, { details: false }),
  ] as const;

  const [contents, stats] = await Promise.all(tasks);

  if (!checkFileIsImage(stats)) {
    throw new Error('File is not an image');
  }

  return new Blob([contents as BlobPart]);
}

/**
 * Check if a file from Nextcloud is actually an image to avoid Konva crashes.
 *
 * @param imageStat file stats returned by nextcloud.
 */
const checkFileIsImage = (
  imageStat: FileStat | ResponseDataDetailed<FileStat> | undefined | null,
): boolean => {
  if (!imageStat) return false;

  const stat = imageStat as FileStat;
  return stat.type === 'file' && Boolean(stat.mime?.startsWith('image'));
};
