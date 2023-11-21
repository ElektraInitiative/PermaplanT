import TransparentBackground from '../TransparentBackground';
import ModalContainer from './ModalContainer';
import { ReactNode } from 'react';

interface ImageModalProps {
  /** Modal headline displayed on top.*/
  title: string;
  /** The main element of the modal, usually an image.*/
  body: ReactNode;
  /** Callback that informs the parent when the modal should be hidden/displayed (e.g. when the user pressed the close button).*/
  setShow: (show: boolean) => void;
  /** Decides whether the modal should be shown.*/
  show: boolean;
  /** Click callback for cancel/close button.*/
  onCancel: () => void;
}

/**
 * A modal component used to display images.
 * @param props.title Modal headline displayed on top.
 * @param props.body The main element of the modal, usually an image.
 * @param props.setShow Callback that informs the parent when the modal should be hidden/displayed (e.g. when the user pressed the close button).
 * @param props.show Decides whether the modal should be shown.
 * @param props.onCancel Click callback for cancel/close button.
 */
export default function ImageModal({ title, body, setShow, show, onCancel }: ImageModalProps) {
  return (
    <>
      <TransparentBackground
        onClick={() => {
          setShow(false);
        }}
        show={show}
      />
      <ModalContainer show={show} onCancelKeyPressed={onCancel}>
        <div className="flex h-[70vh] w-[80vw] flex-col rounded-lg bg-neutral-100 p-6 dark:bg-neutral-100-dark">
          <div className="flex justify-between">
            <h2>{title}</h2>
            <button
              onClick={onCancel}
              className="rounded-lg border border-neutral-600 px-5 py-2.5 text-center text-sm font-medium hover:bg-neutral-600 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
            >
              x
            </button>
          </div>
          <div className="flex h-full max-h-[60vh] w-full justify-center p-4">{body}</div>
        </div>
      </ModalContainer>
    </>
  );
}
