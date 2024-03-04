import { ComponentPropsWithoutRef } from 'react';
import {
  Controller,
  FieldValues,
  Path,
  SubmitErrorHandler,
  SubmitHandler,
  useFormContext,
} from 'react-hook-form';
import { DrawingLayerFillPatterns } from '@/features/map_planning/layers/drawing/DrawingLayerFillPatterns';
import { FillPatternType } from '@/features/map_planning/layers/drawing/types';
import { useDebouncedSubmit } from '@/hooks/useDebouncedSubmit';
import CheckIcon from '@/svg/icons/check.svg?react';
import CircleDottedIcon from '@/svg/icons/circle-dotted.svg?react';
import SimpleFormInput from './SimpleFormInput';

type DebouncedSimpleFormInputProps<T extends FieldValues = FieldValues> = {
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
export function DebouncedFillPatternSelector<T extends FieldValues>({
  onValid,
  onInvalid,
  id,
  'data-testid': testId,
  ...rest
}: DebouncedSimpleFormInputProps<T>) {
  const { handleSubmit, watch, control } = useFormContext<T>();

  const submitState = useDebouncedSubmit<T>(watch(id), handleSubmit, onValid, onInvalid);

  return (
    <div data-testid={testId} className="flex w-full gap-2">
      <Controller
        control={control}
        name={id}
        render={({ field }) => (
          <DrawingLayerFillPatterns
            {...{ id, ...rest }}
            {...field}
            selectedPattern={watch(id) as FillPatternType}
          ></DrawingLayerFillPatterns>
        )}
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
