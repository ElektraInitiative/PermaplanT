import SimpleButton from '../Button/SimpleButton';
import ModalContainer from './ModalContainer';
import TransparentBackground from '../TransparentBackground';

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
        <div className="flex min-h-[200px] w-[400px] flex-col justify-between rounded-lg bg-neutral-100 p-6 dark:bg-neutral-100-dark">
          <h2>{title}</h2>
          <p className="mb">{body}</p>
          <div className="space-between flex flex-row justify-center space-x-8">
            {cancelBtnTitle && (
              <SimpleButton onClick={onCancel} className="max-w-[240px] grow">
                {cancelBtnTitle}
              </SimpleButton>
            )}
            <SimpleButton onClick={onSubmit} className="max-w-[240px] grow">
              {submitBtnTitle}
            </SimpleButton>
          </div>
        </div>
      </ModalContainer>
    </>
  );
}
