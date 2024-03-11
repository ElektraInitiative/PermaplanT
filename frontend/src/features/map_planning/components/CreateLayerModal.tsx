import { FileStat } from 'webdav';
import ModalContainer from '@/components/Modals/ModalContainer';
import TransparentBackground from '@/components/TransparentBackground';

interface CreateLayerModalProps {
  /** Callback that informs the parent when the modal should be hidden/displayed (e.g. when the user pressed the close button).*/
  setShow: (show: boolean) => void;
  /** Decides whether the modal should be shown. */
  show: boolean;
  /** Click callback for cancel/close button.*/
  onCancel: () => void;
  /** Fires when an image was selected */
  onValid: (item: FileStat) => void;
  /** Optional heading for the modal */
  title?: string;
}

export default function CreateLayerModal({ setShow, show, onCancel }: CreateLayerModalProps) {
  return (
    <>
      <TransparentBackground
        onClick={() => {
          setShow(false);
        }}
        show={show}
      />
      <ModalContainer show={show} onCancelKeyPressed={onCancel}>
        <div className="flex h-[70vh] w-[90vw] flex-col rounded-lg bg-neutral-100 p-1 sm:h-[60vh] sm:w-[85vw] md:w-[75vw] md:p-6 lg:w-[60vw] xl:w-[50vw] 2xl:w-[40vw] dark:bg-neutral-100-dark"></div>
      </ModalContainer>
    </>
  );
}
