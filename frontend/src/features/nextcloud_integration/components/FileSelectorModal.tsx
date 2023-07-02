import { FileSelector } from './FileSelector';
import ModalContainer from '@/components/Modals/ModalContainer';
import TransparentBackground from '@/components/TransparentBackground';
import { FileStat } from 'webdav';

interface FileSelectorModalProps {
  /** Callback that informs the parent when the modal should be hidden/displayed (e.g. when the user pressed the close button).*/
  setShow: (show: boolean) => void;
  /** Decides whether the modal should be shown.*/
  show: boolean;
  /** Click callback for cancel/close button.*/
  onCancel: () => void;
  /** path to the directory which files are displayed */
  path: string;
  /** Fires when an image was selected */
  onSelect: (item: FileStat) => void;
}

/**
 * A modal component used to pick a file from a Nextcloud directory.
 */
export default function FileSelectorModal({
  setShow,
  show,
  onCancel,
  path,
  onSelect,
}: FileSelectorModalProps) {
  return (
    <>
      <TransparentBackground
        onClick={() => {
          setShow(false);
        }}
        show={show}
      />
      <ModalContainer show={show}>
        <div className="flex h-[70vh] w-[80vw] flex-col rounded-lg bg-neutral-100 p-6 dark:bg-neutral-100-dark">
          <div className="flex justify-between">
            {/* <h2>{title}</h2> */}
            <button
              onClick={onCancel}
              className="rounded-lg border border-neutral-600 px-5 py-2.5 text-center text-sm font-medium hover:bg-neutral-600 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
            >
              x
            </button>
          </div>
          <div className="flex h-full max-h-[60vh] w-full justify-center p-4">
            <FileSelector path={path} onSelect={onSelect} />
          </div>
        </div>
      </ModalContainer>
    </>
  );
}
