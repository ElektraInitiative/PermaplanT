import { FileStat } from 'webdav';
import IconButton from '@/components/Button/IconButton';
import ModalContainer from '@/components/Modals/ModalContainer';
import TransparentBackground from '@/components/TransparentBackground';
import CloseIcon from '@/svg/icons/close.svg?react';
import { FileSelector } from './FileSelector';

interface FileSelectorModalProps {
  /** Callback that informs the parent when the modal should be hidden/displayed (e.g. when the user pressed the close button).*/
  setShow: (show: boolean) => void;
  /** Decides whether the modal should be shown. */
  show: boolean;
  /** Click callback for cancel/close button.*/
  onCancel: () => void;
  /** Path to the directory of which files are displayed */
  path: string;
  /** Fires when an image was selected */
  onSelect: (item: FileStat) => void;
  /** Optional heading for the modal */
  title?: string;
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
  title,
}: FileSelectorModalProps) {
  return (
    <>
      <TransparentBackground
        onClick={() => {
          setShow(false);
        }}
        show={show}
      />
      <ModalContainer show={show} onCancelKeyPressed={onCancel}>
        <div className="flex h-[70vh] w-[90vw] flex-col rounded-lg bg-neutral-100 p-1 sm:h-[60vh] sm:w-[85vw] md:w-[75vw] md:p-6 lg:w-[60vw] xl:w-[50vw] 2xl:w-[40vw] dark:bg-neutral-100-dark">
          <IconButton
            className="absolute right-3 top-3 h-7 w-7 place-self-end overflow-hidden p-0.5"
            onClick={onCancel}
            data-tourid="file-selector-modal____close-icon"
          >
            <CloseIcon></CloseIcon>
          </IconButton>
          {title && <h2 className="p-2 text-center md:p-0">{title}</h2>}
          <div className="flex h-full w-full flex-col overflow-hidden p-4">
            <FileSelector path={path} onSelect={onSelect} />
          </div>
        </div>
      </ModalContainer>
    </>
  );
}
