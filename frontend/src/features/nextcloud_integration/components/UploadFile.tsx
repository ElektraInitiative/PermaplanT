import SimpleButton from '@/components/Button/SimpleButton';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { useNextcloudWebDavClient } from '@/config/nextcloud_client';
import { errorToastGrouped } from '@/features/toasts/groupedToast';
import { useMutation } from '@tanstack/react-query';
import { ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Readable } from 'stream';
import { BufferLike, WebDAVClient } from 'webdav';

const WEBDAV_PATH = '/remote.php/webdav/';

type FileOptions = {
  name: string;
  buffer: string | BufferLike | Readable;
  path: string;
};
type UploadFileProps = {
  path: string;
  onSuccess?: (data: boolean, variables: FileOptions, context: unknown) => unknown;
};
export const UploadFile = (props: UploadFileProps) => {
  const { path, onSuccess } = props;
  const webdav = useNextcloudWebDavClient();
  const { t } = useTranslation(['uploadFile']);

  const addFile = useMutation({
    mutationFn: (file: FileOptions) => {
      return (webdav as WebDAVClient).putFileContents(
        WEBDAV_PATH + file.path + '/' + file.name,
        file.buffer,
      );
    },
    onError: () => {
      errorToastGrouped(t('uploadFile:upload_error'));
    },
    onSuccess: (data, variables, context) => {
      toast.success(variables.name + ' successfully uploaded!');
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
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

    const reader = new FileReader();

    reader.onload = (e) => {
      const buffer = e.target?.result;
      if (!buffer) {
        console.error('no file selected');
        return;
      }
      addFile.mutate({ path, name: file.name, buffer });
    };
    reader.readAsArrayBuffer(file);
  };

  if (addFile.isLoading)
    return (
      <div className="w-8">
        <LoadingSpinner />
      </div>
    );

  return (
    <SimpleButton>
      <label className="cursor-pointer" htmlFor="file-upload">
        {t('uploadFile:upload_file')}
      </label>
      <input id="file-upload" type="file" onChange={handleFileUpload} className="hidden" />
    </SimpleButton>
  );
};
