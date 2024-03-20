import { useState, useEffect } from 'react';
import {
  FieldValues,
  UseFormHandleSubmit,
  SubmitHandler,
  SubmitErrorHandler,
  FieldErrors,
} from 'react-hook-form';
import useDebounceEffect from './useDebounceEffect';

const SUBMIT_DELAY = 1000;

type SubmitState = 'loading' | 'idle' | 'error';

export function useDebouncedSubmit<T extends FieldValues>(
  value: T[keyof T],
  handleSubmit: UseFormHandleSubmit<T>,
  onValid: SubmitHandler<T>,
  onInvalid?: SubmitErrorHandler<T> | undefined,
) {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [lastValue, setLastValue] = useState<T[keyof T]>(value);

  useEffect(() => {
    if (value === lastValue) {
      return;
    }

    setLastValue(value);
    setSubmitState('loading');
  }, [value, lastValue]);

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
