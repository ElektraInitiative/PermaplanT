import { ComponentPropsWithoutRef, useState } from 'react';
import {
  FieldValues,
  Path,
  PathValue,
  SubmitErrorHandler,
  SubmitHandler,
  useFormContext,
} from 'react-hook-form';
import { useDebouncedSubmit } from '@/hooks/useDebouncedSubmit';
import CheckIcon from '@/svg/icons/check.svg?react';
import CircleDottedIcon from '@/svg/icons/circle-dotted.svg?react';
import MarkdownEditor, { MarkdownEditorCommands } from './MarkdownEditor';
import SimpleFormInput from './SimpleFormInput';

type DebouncedMarkdownEditorFormInputProps<T extends FieldValues = FieldValues> = {
  /** A function that takes the from values.
   * It is called if the settled value of the input is valid */
  onValid: SubmitHandler<T>;
  /** A function that takes the form error.
   * It is called if the settled value of the input is invalid */
  onInvalid?: SubmitErrorHandler<T> | undefined;

  /** The default value of the input */
  defaultValue?: string;

  /** Text that should be displayed in the accompanying label component. */
  labelContent: string;

  /** Whether the editor should be in fullscreen mode. */
  fullScreen?: boolean;

  /** Callback that is called when the editor enters or exits fullscreen mode. */
  changeFullScreen?: (fullScreen: boolean) => void;

  /** The elements unique id.
   * Gets passed to react-hook-form to identify which field the input belongs to. */
  id: Path<T>;
  /** The test id for the input */
  'data-testid'?: string;
} & Omit<SimpleFormInputProps, 'aria-invalid' | 'id' | 'register'>;

type SimpleFormInputProps = ComponentPropsWithoutRef<typeof SimpleFormInput>;

/**
 * A wrapper around {@link SimpleFormInput} that adds a loading spinner or checkmark
 * to the right of the input depending on the state of a debounced submit.
 *
 * # Important
 * It is using the {@link useFormContext} hook, so it must be rendered inside a FormProvider.
 *
 * @param props - {@link DebouncedSimpleFormInputProps}
 * @returns
 */
export function DebouncedMarkdownEditorFormInput<T extends FieldValues>({
  onValid,
  onInvalid,
  fullScreen,
  changeFullScreen,
  defaultValue,
  labelContent,
  id,
  'data-testid': testId,
  ...rest
}: DebouncedMarkdownEditorFormInputProps<T>) {
  const { handleSubmit, watch, register, setValue } = useFormContext<T>();

  const submitState = useDebouncedSubmit<T>(watch(id), handleSubmit, onValid, onInvalid);
  const [plantingNotes, setPlantingNotes] = useState<string | undefined>(defaultValue);

  return (
    <div data-testid={testId} className="flex w-full gap-2">
      <MarkdownEditor
        className="w-full"
        key={id}
        aria-invalid={submitState === 'error'}
        {...{ id, ...rest }}
        {...register}
        labelText={labelContent}
        onChange={(value) => {
          setValue(id, value as PathValue<T, Path<T>>);
          setPlantingNotes(value);
        }}
        commands={[
          MarkdownEditorCommands.bold,
          MarkdownEditorCommands.checkedListCommand,
          MarkdownEditorCommands.divider,
        ]}
        enableSplitView={false}
        showFullScreenToggle={true}
        fullScreen={fullScreen}
        fullScreenChange={changeFullScreen}
        value={plantingNotes}
        preview="edit"
      />

      {submitState === 'loading' && (
        <CircleDottedIcon
          className="mb-3 mt-auto h-5 w-5 flex-shrink-0 animate-spin text-secondary-400"
          data-testid="form-input-loading"
        />
      )}
      {submitState === 'idle' && (
        <CheckIcon
          className="mb-3 mt-auto h-5 w-5 flex-shrink-0 text-primary-400"
          data-testid="form-input-idle"
        />
      )}
    </div>
  );
}
