import { ImageBlob } from './ImageBlob';
import SimpleButton from '@/components/Button/SimpleButton';
import { createNextcloudWebDavClient } from '@/config/nextcloud_client';
import { useEffect, useState } from 'react';
import { ChangeEventHandler } from 'react';
import { Readable } from 'stream';
import { BufferLike, ResponseDataDetailed, FileStat } from 'webdav';

/**
 * component used for testing different webdav api call
 * It showcases the image upload and fetch functionality with webdav.
   As soon as the functionality has been implemented in the layers and the gallery
   for the website the component and the corresponding route can be removed.
 */
export const WebdavTest = () => {
  const [files, setFiles] = useState<FileStat[]>();
  const [image, setImage] = useState<
    string | BufferLike | ResponseDataDetailed<string | BufferLike>
  >('');
  const [fileBuffer, setFileBuffer] = useState<string | BufferLike | Readable>('');
  const [fileName, setFileName] = useState('');
  const webdav = createNextcloudWebDavClient();
  const path = '/remote.php/webdav/Photos/';

  useEffect(() => {
    getFiles();
  }, []);

  /**
   * upload image to Nextcloud
   */
  async function uploadImage() {
    webdav.putFileContents(path + fileName, fileBuffer);
  }

  /**
   * load image from device
   */
  const handleFileUpload: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target?.files) {
      console.error('no file selected');
      return;
    }
    const file = event.target.files[0];

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const buffer = e.target?.result;
      if (!buffer) {
        console.error('no file selected');
        return;
      }
      setFileBuffer(buffer);
    };
    reader.readAsArrayBuffer(file);
  };

  /**
   * load list of available files from Nextcloud at path
   */
  async function getFiles() {
    const files = await webdav.getDirectoryContents(path);
    if (Array.isArray(files)) {
      setFiles(files);
    }
    if (!files) return;
  }

  /**
   * load filecontents from Nextcloud at path
   */
  async function getImage(filename: string) {
    const imageBuffer = await webdav.getFileContents(filename);
    setImage(imageBuffer);
  }

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-4">
      {/* display a list of all files available at path */}
      <ul>
        {files?.map((file) => (
          <li
            className="cursor-pointer hover:text-primary-400"
            onClick={() => getImage(file.filename)}
          >
            {file.filename}
          </li>
        ))}
      </ul>
      {/* display selected image */}
      <div className="w-64">
        <ImageBlob image={new Blob([image as BlobPart])} />
      </div>
      {/* upload an image to path */}
      <div className="w-32">
        <input type="file" onChange={handleFileUpload} />
        <SimpleButton onClick={uploadImage}>upload image</SimpleButton>
      </div>
    </div>
  );
};
