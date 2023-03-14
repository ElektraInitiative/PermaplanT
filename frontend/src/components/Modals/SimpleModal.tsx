import ModalContainer from './ModalContainer';
import TransparentBackground from '@/components/TransparentBackground';

interface SimpleModalProps {
  title: string;
  body: string;
  setShow: (show: boolean) => void;
  show: boolean;
  cancelBtnTitle?: string;
  submitBtnTitle: string;
  onCancel?: () => void;
  onSubmit: () => void;
}

export default function SimpleModal({
  title,
  body,
  show,
  setShow,
  cancelBtnTitle,
  submitBtnTitle,
  onCancel,
  onSubmit,
}: SimpleModalProps) {
  return (
    <>
      <TransparentBackground
        onClick={() => {
          setShow(false);
        }}
        show={show}
      />
      <ModalContainer show={show}>
        <div className="flex min-h-[200px] w-[400px] flex-col justify-between rounded-lg bg-primary-background p-6">
          <h2>{title}</h2>
          <p className="mb">{body}</p>
          <div className="space-between flex flex-row justify-center space-x-8">
            {cancelBtnTitle && (
              <button
                onClick={onCancel}
                className="max-w-[240px] grow rounded-lg border border-zinc-600 px-5 py-2.5 text-center text-sm font-medium hover:bg-zinc-600 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
              >
                {cancelBtnTitle}
              </button>
            )}
            <button
              onClick={onSubmit}
              className="max-w-[240px] grow rounded-lg bg-gray-500 px-5 py-2.5 text-center text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
            >
              {submitBtnTitle}
            </button>
          </div>
        </div>
      </ModalContainer>
    </>
  );
}
