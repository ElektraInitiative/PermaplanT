import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { useDebouncedSubmit } from '@/hooks/useDebouncedSubmit';
import { ReactComponent as CheckIcon } from '@/icons/check.svg';
import { ReactComponent as CircleDottedIcon } from '@/icons/circle-dotted.svg';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

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

const TimelineFormSchema = z.object({
  date: z.string().nonempty(),
});

// const timelineResolver: Resolver<TimelineFormData> = (values) => {
//   const parsedDate = convertToDate(values.date);

//   const errors: FieldErrors<TimelineFormData> = {};

//   if (isNaN(parsedDate.getTime())) {
//     errors.date = { message: , type: 'validate' };
//   }

//   return {
//     errors,
//     values,
//   };
// };

export function Timeline({ onSelectDate, defaultDate }: TimelineProps) {
  const { t } = useTranslation(['timeline']);

  const { register, handleSubmit, watch } = useForm<TimelineFormData>({
    defaultValues: {
      date: defaultDate,
    },
    resolver: zodResolver(TimelineFormSchema),
  });

  const onFormSubmit = ({ date }: TimelineFormData) => {
    onSelectDate(date);
  };

  const submitState = useDebouncedSubmit<TimelineFormData>(
    watch('date'),
    handleSubmit,
    onFormSubmit,
  );

  return (
    <form
      className="flex justify-center gap-2 border-t-2 border-neutral-700 py-1"
      data-testid="timeline"
    >
      <SimpleFormInput
        aria-invalid={submitState === 'error'}
        type="date"
        id="date"
        labelText={t('timeline:change_date')}
        register={register}
        title={t('timeline:change_date_hint')}
      />

      {submitState === 'loading' && (
        <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
      )}
      {submitState === 'idle' && <CheckIcon className="mb-3 mt-auto h-5 w-5 text-primary-400" />}
      {submitState === 'error' && (
        <span className="mb-3 mt-auto text-sm text-red-400">{t('timeline:date_error')}</span>
      )}
    </form>
  );
}
