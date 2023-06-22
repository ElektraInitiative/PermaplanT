import { NextcloudImage } from './NextcloudImage';
import SimpleButton from '@/components/Button/SimpleButton';
import { useNextcloudWebDavClient } from '@/config/nextcloud_client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ChangeEventHandler } from 'react';
import { Readable } from 'stream';
import { BufferLike } from 'webdav';

/**
 * component used for testing different webdav api call
 * It showcases the image upload and fetch functionality with webdav.
   As soon as the functionality has been implemented in the layers and the gallery
   for the website the component and the corresponding route can be removed.
 */
export const WebdavTest = () => {
  const [fileBuffer, setFileBuffer] = useState<string | BufferLike | Readable>('');
  const [fileName, setFileName] = useState('');
  const [imageName, setImageName] = useState('');
  const path = '/Photos/';

  const webdav = useNextcloudWebDavClient();

  const { data: files, refetch: refetchFiles } = useQuery(['files', path, webdav], () => {
    if (!webdav) return null;
    return webdav.getDirectoryContents('/remote.php/webdav/' + path);
  });

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
   * upload image to Nextcloud
   */
  async function uploadImage() {
    if (!webdav) return;
    webdav.putFileContents(path + fileName, fileBuffer);
  }

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-4">
      {/* display a list of all files available at path */}
      <ul>
        {files && Array.isArray(files)
          ? files.map((file) => (
              <li
                className="cursor-pointer hover:text-primary-400"
                key={file.filename}
                onClick={() => setImageName(file.filename)}
              >
                {file.filename}
              </li>
            ))
          : []}
      </ul>
      <SimpleButton onClick={() => refetchFiles()} className="w-auto">
        reload
      </SimpleButton>
      {/* display selected image */}
      <div className="w-64">
        {/* TODO: fix path */}
        <NextcloudImage path={imageName} />
      </div>
      {/* upload an image to path */}
      <div className="w-32">
        <input type="file" onChange={handleFileUpload} />
        <SimpleButton onClick={uploadImage}>upload image</SimpleButton>
      </div>
    </div>
  );
};
