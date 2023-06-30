import SimpleButton from '@/components/Button/SimpleButton';
import { useNextcloudWebDavClient } from '@/config/nextcloud_client';
import { useMutation } from '@tanstack/react-query';
import { ChangeEventHandler, useState } from 'react';
import { Readable } from 'stream';
import { BufferLike, WebDAVClient } from 'webdav';

const WEBDAV_PATH = "/remote.php/webdav/"

type UploadFileProps = {
  path: string
}
export const UploadFile = (props: UploadFileProps) => {
  const { path } = props
  const webdav = useNextcloudWebDavClient();

  const [fileBuffer, setFileBuffer] = useState<string | BufferLike | Readable>('');
  const [fileName, setFileName] = useState('');

  type FileOptions = {
    name: string,
    buffer: string | BufferLike | Readable,
    path: string
  }
  const addFile = useMutation({
    mutationFn: (file: FileOptions) => {
      return (webdav as WebDAVClient).putFileContents(
        WEBDAV_PATH + file.path + "/" + file.name, file.buffer
      );
    }
  })

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

  return <div className="w-32">
    <input type="file" onChange={handleFileUpload} />
    <SimpleButton onClick={() => addFile.mutate({ path, name: fileName, buffer: fileBuffer })}>upload image</SimpleButton>
  </div>
}
