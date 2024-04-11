import { ComponentPropsWithoutRef } from 'react';
import {
  FieldValues,
  Path,
  SubmitErrorHandler,
  SubmitHandler,
  useFormContext,
} from 'react-hook-form';
import { useDebouncedSubmit } from '@/hooks/useDebouncedSubmit';
import CheckIcon from '@/svg/icons/check.svg?react';
import CircleDottedIcon from '@/svg/icons/circle-dotted.svg?react';
import SimpleFormTextArea from './SimpleFormTextArea';

type DebouncedSimpleFormTextAreatProps<T extends FieldValues = FieldValues> = {
  /** A function that takes the from values.
   * It is called if the settled value of the input is valid */
  onValid: SubmitHandler<T>;
  /** A function that takes the form error.
   * It is called if the settled value of the input is invalid */
  onInvalid?: SubmitErrorHandler<T> | undefined;
  /** The elements unique id.
   * Gets passed to react-hook-form to identify which field the input belongs to. */
  id: Path<T>;
  /** The test id for the input */
  'data-testid'?: string;
} & Omit<SimpleFormInputProps, 'aria-invalid' | 'id' | 'register'>;

type SimpleFormInputProps = ComponentPropsWithoutRef<typeof SimpleFormTextArea>;

export function DebouncedSimpleFormTextArea<T extends FieldValues>({
  onValid,
  onInvalid,
  id,
  'data-testid': testId,
  ...rest
}: DebouncedSimpleFormTextAreatProps<T>) {
  const { handleSubmit, register, watch } = useFormContext<T>();

  const submitState = useDebouncedSubmit<T>(watch(id), handleSubmit, onValid, onInvalid);

  return (
    <div data-testid={testId} className="flex gap-2">
      <SimpleFormTextArea {...{ id, register, ...rest }} aria-invalid={submitState === 'error'} />
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
