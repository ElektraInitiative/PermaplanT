import SimpleButton from '../Button/SimpleButton';
import TransparentBackground from '../TransparentBackground';
import ModalContainer from './ModalContainer';

interface ExtendedModalProps {
  /** Modal headline displayed on top.*/
  title: string;
  /** The text of the modal.*/
  body: string;
  /** Decides whether the modal should be shown.*/
  show: boolean;
  /** Click callback for cancel/close button.*/
  onCancel?: () => void;
  /** label of the cancel/abort button. */
  cancelBtnTitle?: string;
  /** label of the first action button. */
  firstActionBtnTitle: string;
  /** first action button onClick event handler. */
  onFirstAction: () => void;
  /** label of the second action button. */
  secondActionBtnTitle: string;
  /** second action button onClick event handler. */
  onSecondAction: () => void;
}

/** Simple Modal used for prompts */
export default function CancelConfirmationModal({
  title,
  body,
  show,
  cancelBtnTitle,
  firstActionBtnTitle,
  secondActionBtnTitle,
  onCancel,
  onFirstAction,
  onSecondAction,
}: ExtendedModalProps) {
  return (
    <>
      <TransparentBackground show={show} />
      <ModalContainer show={show} onCancelKeyPressed={onCancel}>
        <div className="flex min-h-[250px] w-[450px] flex-col justify-between rounded-lg bg-neutral-100 p-4 dark:bg-neutral-100-dark">
          <h2 className="mb-4">{title}</h2>
          <p className="mb-4">{body}</p>
          <div className="space-between flex flex-row justify-center space-x-2">
            {cancelBtnTitle && (
              <SimpleButton onClick={onCancel} className="mr-6 max-w-[240px] grow">
                {cancelBtnTitle}
              </SimpleButton>
            )}
            <SimpleButton onClick={onFirstAction} className="max-w-[240px] grow">
              {firstActionBtnTitle}
            </SimpleButton>
            <SimpleButton onClick={onSecondAction} className="max-w-[240px] grow">
              {secondActionBtnTitle}
            </SimpleButton>
          </div>
        </div>
      </ModalContainer>
    </>
  );
}
