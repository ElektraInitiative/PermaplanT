import { convertToDate } from '../../utils/date-utils';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import useDebounceEffect from '@/hooks/useDebounceEffect';
import { ReactComponent as CheckIcon } from '@/icons/check.svg';
import { ReactComponent as CircleDottedIcon } from '@/icons/circle-dotted.svg';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { FieldErrors, Resolver, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type TimelineProps = {
  /** Is called if the user selects a date from the timeline.
   * The date is passed as a string in the format 'YYYY-MM-DD'
   */
  onSelectDate: (date: string) => void;

  /**
   * The default date to be selected on the timeline.
   */
  defaultDate: string;
};

type TimelineFormData = {
  date: string;
};

const timelineResolver: Resolver<TimelineFormData> = (values) => {
  const parsedDate = convertToDate(values.date);

  const errors: FieldErrors<TimelineFormData> = {};

  if (isNaN(parsedDate.getTime())) {
    errors.date = { message: i18next.t('timeline:date_error'), type: 'validate' };
  }

  return {
    errors,
    values,
  };
};

const SUBMIT_DELAY = 1000;

export function Timeline({ onSelectDate, defaultDate }: TimelineProps) {
  const { t } = useTranslation(['timeline']);
  const [timelineState, setTimelineState] = useState<'submitting' | 'set' | 'error'>('set');

  const { register, handleSubmit, watch, formState } = useForm<TimelineFormData>({
    defaultValues: {
      date: defaultDate,
    },
    resolver: timelineResolver,
  });

  const date = watch('date');
  useEffect(() => {
    if (date === defaultDate) {
      return;
    }

    setTimelineState('submitting');
  }, [date, defaultDate]);

  useDebounceEffect(
    () => {
      if (timelineState === 'set' || timelineState === 'error') {
        return;
      }

      handleSubmit(onFormSubmit, onFormError)();
    },
    SUBMIT_DELAY,
    [date],
  );

  const onFormSubmit = ({ date }: TimelineFormData) => {
    onSelectDate(date);
    setTimelineState('set');
  };

  const onFormError = () => {
    setTimelineState('error');
  };

  return (
    <form className="flex justify-center gap-2 border-t-2 border-neutral-700 py-1">
      <SimpleFormInput
        aria-invalid={timelineState === 'error'}
        type="date"
        id="date"
        labelText={t('timeline:change_date')}
        register={register}
        title={t('timeline:change_date_hint')}
      />

      {timelineState === 'submitting' && (
        <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
      )}
      {timelineState === 'set' && <CheckIcon className="mb-3 mt-auto h-5 w-5 text-primary-400" />}
      {timelineState === 'error' && (
        <span className="mb-3 mt-auto text-sm text-red-400">{formState.errors?.date?.message}</span>
      )}
    </form>
  );
}
