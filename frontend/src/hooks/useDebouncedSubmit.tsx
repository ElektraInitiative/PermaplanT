import useDebounceEffect from './useDebounceEffect';
import { useState, useEffect } from 'react';
import {
  FieldValues,
  UseFormHandleSubmit,
  SubmitHandler,
  SubmitErrorHandler,
  FieldErrors,
} from 'react-hook-form';

const SUBMIT_DELAY = 1000;

export function useDebouncedSubmit<T extends FieldValues>(
  value: T[keyof T],
  defaultValue: T[keyof T],
  handleSubmit: UseFormHandleSubmit<T>,
  onValid: SubmitHandler<T>,
  onInvalid?: SubmitErrorHandler<T> | undefined,
) {
  const [submitState, setSubmitState] = useState<'loading' | 'idle' | 'error'>('idle');

  useEffect(() => {
    if (value === defaultValue) {
      return;
    }

    setSubmitState('loading');
  }, [value, defaultValue]);

  useDebounceEffect(
    () => {
      if (submitState === 'idle' || submitState === 'error') {
        return;
      }

      handleSubmit(onFormSubmit, onFormError)();
    },
    SUBMIT_DELAY,
    [value],
  );

  const onFormSubmit = (data: T) => {
    onValid(data);
    setSubmitState('idle');
  };

  const onFormError = (errors: FieldErrors<T>) => {
    onInvalid?.(errors);
    setSubmitState('error');
  };

  return submitState;
}
