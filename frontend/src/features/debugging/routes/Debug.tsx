import SimpleButton from '@/components/Button/SimpleButton';
import { WebdavTest } from '@/features/nextcloud_integration/components/webdav-test';
import { error, info, success, warning } from '@/features/toasts/groupedToast';

export function Debug() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="flex flex-col">
        <h2 className="mb-2 text-center">Create grouped Toasts</h2>
        <SimpleButton onClick={() => error('Error')}>Error</SimpleButton>
        <SimpleButton onClick={() => info('Info')}>Info</SimpleButton>
        <SimpleButton onClick={() => warning('Warning')}>Warning</SimpleButton>
        <SimpleButton onClick={() => success('Success')}>Success</SimpleButton>
      </div>
      <div>
        <h2 className="mb-2 text-center">WebDAV Test</h2>
        <WebdavTest />
      </div>
    </div>
  );
}
