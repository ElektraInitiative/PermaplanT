import { PlantingDto, PlantsSummaryDto } from '@/bindings/definitions';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { useDebouncedSubmit } from '@/hooks/useDebouncedSubmit';
import { ReactComponent as CheckIcon } from '@/icons/check.svg';
import { ReactComponent as CircleDottedIcon } from '@/icons/circle-dotted.svg';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export type PlantingAttributeEditFormData = Pick<PlantingDto, 'addDate' | 'removeDate'>;

const PlantingAttributeEditFormSchema = z.object({
  addDate: z.nullable(z.string()).transform((value) => value || null),
  removeDate: z.nullable(z.string()).transform((value) => value || null),
});

export type PlantingAttributeEditFormProps = {
  planting: PlantingDto;
  plant: PlantsSummaryDto;
  onDeleteClick: () => void;
  onAddDateChange: (addDate: PlantingAttributeEditFormData) => void;
  onRemoveDateChange: (removeDate: PlantingAttributeEditFormData) => void;
};

export function PlantingAttributeEditForm({
  plant,
  planting,
  onDeleteClick,
  onAddDateChange,
  onRemoveDateChange,
}: PlantingAttributeEditFormProps) {
  const { t } = useTranslation(['plantEdit']);

  const { register, handleSubmit, watch, formState } = useForm<PlantingAttributeEditFormData>({
    defaultValues: {
      addDate: planting.addDate,
      removeDate: planting.removeDate,
    },
    resolver: zodResolver(PlantingAttributeEditFormSchema),
  });

  const addDateSubmitState = useDebouncedSubmit<PlantingAttributeEditFormData>(
    watch('addDate'),
    planting.addDate,
    handleSubmit,
    onAddDateChange,
    (e) => console.error(e),
  );

  const removeDateSubmitState = useDebouncedSubmit<PlantingAttributeEditFormData>(
    watch('removeDate'),
    planting.removeDate,
    handleSubmit,
    onRemoveDateChange,
    (e) => console.error(e),
  );

  return (
    <div className="flex flex-col gap-2 p-2">
      <h2>{plant?.unique_name}</h2>

      <div className="flex gap-2">
        <SimpleFormInput type="date" id="addDate" labelText="Add date" register={register} />
        {addDateSubmitState === 'loading' && (
          <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
        )}
        {addDateSubmitState === 'idle' && (
          <CheckIcon className="mb-3 mt-auto h-5 w-5 text-primary-400" />
        )}
        {addDateSubmitState === 'error' && (
          <span className="mb-3 mt-auto text-sm text-red-400">
            {formState.errors?.addDate?.message}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <SimpleFormInput type="date" id="removeDate" labelText="Remove date" register={register} />
        {removeDateSubmitState === 'loading' && (
          <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
        )}
        {removeDateSubmitState === 'idle' && (
          <CheckIcon className="mb-3 mt-auto h-5 w-5 text-primary-400" />
        )}
        {removeDateSubmitState === 'error' && (
          <span className="mb-3 mt-auto text-sm text-red-400">
            {formState.errors?.removeDate?.message}
          </span>
        )}
      </div>

      <SimpleButton variant={ButtonVariant.dangerBase} onClick={onDeleteClick}>
        {t('plantEdit:delete')}
      </SimpleButton>
    </div>
  );
}
