import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { useForm } from 'react-hook-form';

type TimelineProps = {
  /** Is called if the user selects a date from the timeline */
  onSelectDate: (date: Date) => void;
};

type TimelineFormData = {
  date: Date;
};

export function Timeline({ onSelectDate }: TimelineProps) {
  const { register, handleSubmit } = useForm<TimelineFormData>();

  const onFormSubmit = ({ date }: TimelineFormData) => {
    onSelectDate(date);
  };

  return (
    <form className="flex items-end justify-center gap-2" onSubmit={handleSubmit(onFormSubmit)}>
      <SimpleFormInput
        type="date"
        id="date"
        labelText=""
        register={register}
        defaultValue={new Date().toISOString().slice(0, 10)}
      />
      <div className="w-52">
        <SimpleButton type="submit">Change map date</SimpleButton>
      </div>
    </form>
  );
}
