import SimpleButton from '../Button/SimpleButton';
import TransparentBackground from '../TransparentBackground';
import ModalContainer from './ModalContainer';

interface SimpleModalProps {
  /** Modal headline displayed on top.*/
  title: string;
  /** The text of the modal.*/
  body: string;
  /** Callback that informs the parent when the modal should be hidden/displayed (e.g. when the user pressed the close button).*/
  setShow: (show: boolean) => void;
  /** Decides whether the modal should be shown.*/
  show: boolean;
  /** Click callback for cancel/close button.*/
  onCancel?: () => void;
  /** label of the cancel/abort button. */
  cancelBtnTitle?: string;
  /** label of the submit/ok button. */
  submitBtnTitle: string;
  /** submit button onClick event handler. */
  onSubmit: () => void;
}

/** Simple Modal used for prompts */
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
