import ModalContainer from './ModalContainer';
import TransparentBackground from '@/components/TransparentBackground';
import { ReactNode } from 'react';

interface ImageModalProps {
  title: string;
  body: ReactNode;
  setShow: (show: boolean) => void;
  show: boolean;
  onCancel: () => void;
}

export default function SimpleModal({ title, body, show, setShow, onCancel }: ImageModalProps) {
  return (
    <>
      <TransparentBackground
        onClick={() => {
          setShow(false);
        }}
        show={show}
      />
      <ModalContainer show={show}>
        <div className="flex h-full min-h-[40vh] w-full min-w-[40vw] flex-col rounded-lg bg-primary-background p-6">
          <div className="flex justify-between">
            <h2>{title}</h2>
            <button
              onClick={onCancel}
              className="rounded-lg border border-zinc-600 px-5 py-2.5 text-center text-sm font-medium hover:bg-zinc-600 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
            >
              x
            </button>
          </div>
          <div className="flex justify-center">{body}</div>
        </div>
      </ModalContainer>
    </>
  );
}
