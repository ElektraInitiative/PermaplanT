import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { useForm } from 'react-hook-form';

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

export function Timeline({ onSelectDate, defaultDate }: TimelineProps) {
  const { register, handleSubmit } = useForm<TimelineFormData>({
    defaultValues: {
      date: defaultDate,
    },
  });

  const onFormSubmit = ({ date }: TimelineFormData) => {
    onSelectDate(date);
  };

  return (
    <form className="flex items-end justify-center gap-2" onSubmit={handleSubmit(onFormSubmit)}>
      <SimpleFormInput type="date" id="date" labelText="" register={register} />
      <div className="w-52">
        <SimpleButton type="submit">Change map date</SimpleButton>
      </div>
    </form>
  );
}
