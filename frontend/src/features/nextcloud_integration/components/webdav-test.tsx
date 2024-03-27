import { useState } from 'react';
import { FileSelector } from './FileSelector';
import { NextcloudImage } from './NextcloudImage';

/**
 * component used for testing different webdav api call
 * It showcases the image upload and fetch functionality with webdav.
   As soon as the functionality has been implemented in the layers and the gallery
   for the website the component and the corresponding route can be removed.
 */
export const WebdavTest = () => {
  const [imageName, setImageName] = useState('');
  const path = '/Photos/';

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-4">
      <FileSelector path={path} onSelect={(item) => setImageName(path + item.basename)} />
      {/* display selected image */}
      <div className="w-64">
        {/* TODO: fix path */}
        <NextcloudImage path={imageName} />
      </div>
    </div>
  );
};
