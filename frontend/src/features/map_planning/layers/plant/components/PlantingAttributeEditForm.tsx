import { PlantingDto, PlantsSummaryDto } from '@/bindings/definitions';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { useDebouncedSubmit } from '@/hooks/useDebouncedSubmit';
import { ReactComponent as CheckIcon } from '@/icons/check.svg';
import { ReactComponent as CircleDottedIcon } from '@/icons/circle-dotted.svg';
import { PlantNameFromPlant } from '@/utils/plant-naming';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export type PlantingAttributeEditFormData = Pick<PlantingDto, 'addDate' | 'removeDate'>;

const PlantingAttributeEditFormSchema = z
  // The 'empty' value for the API is undefined, so we need to transform the empty string to undefined
  .object({
    addDate: z.nullable(z.string()).transform((value) => value || undefined),
    removeDate: z.nullable(z.string()).transform((value) => value || undefined),
  })
  .refine((schema) => !schema.removeDate || !schema.addDate || schema.addDate < schema.removeDate, {
    path: ['dateRelation'],
  });

export type PlantingAttributeEditFormProps = {
  planting: PlantingDto;
  plant: PlantsSummaryDto;
  onDeleteClick: () => void;
  onAddDateChange: (addDate: PlantingAttributeEditFormData) => void;
  onRemoveDateChange: (removeDate: PlantingAttributeEditFormData) => void;
  disabled?: boolean;
};

export function PlantingAttributeEditForm({
  plant,
  planting,
  onDeleteClick,
  onAddDateChange,
  onRemoveDateChange,
  disabled,
}: PlantingAttributeEditFormProps) {
  const { t } = useTranslation(['plantings']);

  const { register, handleSubmit, watch, formState } = useForm<PlantingAttributeEditFormData>({
    // The 'empty' value for the native date input is an empty string, not null | undefined
    defaultValues: {
      addDate: planting.addDate || '',
      removeDate: planting.removeDate || '',
    },
    resolver: zodResolver(PlantingAttributeEditFormSchema),
  });

  const addDateSubmitState = useDebouncedSubmit<PlantingAttributeEditFormData>(
    watch('addDate'),
    handleSubmit,
    onAddDateChange,
    (e) => console.error(e),
  );

  const removeDateSubmitState = useDebouncedSubmit<PlantingAttributeEditFormData>(
    watch('removeDate'),
    handleSubmit,
    onRemoveDateChange,
    (e) => console.error(e),
  );

  return (
    <div className="flex flex-col gap-2 p-2">
      <h2>
        <PlantNameFromPlant plant={plant} />
      </h2>

      <div className="flex gap-2">
        <SimpleFormInput
          type="date"
          id="addDate"
          disabled={disabled}
          aria-invalid={addDateSubmitState === 'error'}
          labelText={t('plantings:add_date')}
          register={register}
          className="w-36"
        />
        {addDateSubmitState === 'loading' && (
          <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
        )}
        {addDateSubmitState === 'idle' && (
          <CheckIcon className="mb-3 mt-auto h-5 w-5 text-primary-400" />
        )}
      </div>
      <p className="pb-4 text-[0.8rem] text-neutral-400">{t('plantings:add_date_description')}</p>

      <div className="flex gap-2">
        <SimpleFormInput
          type="date"
          id="removeDate"
          disabled={disabled}
          aria-invalid={removeDateSubmitState === 'error'}
          labelText={t('plantings:remove_date')}
          register={register}
          className="w-36"
        />
        {removeDateSubmitState === 'loading' && (
          <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
        )}
        {removeDateSubmitState === 'idle' && (
          <CheckIcon className="mb-3 mt-auto h-5 w-5 text-primary-400" />
        )}
      </div>

      <p className="text-[0.8rem] text-neutral-400">{t('plantings:remove_date_description')}</p>

      {/**
       * See https://github.com/orgs/react-hook-form/discussions/7111
       * @ts-expect-error this error path was added by zod refine(). hook form is unaware, which is a shortcoming.*/}
      {formState.errors.dateRelation && (
        <span className="mb-3 mt-auto text-sm text-red-400">
          {t('plantings:error_invalid_add_remove_date')}
        </span>
      )}

      <hr className="my-4 border-neutral-700" />

      <SimpleButton
        disabled={disabled}
        variant={ButtonVariant.dangerBase}
        onClick={onDeleteClick}
        className="w-36"
        data-tourid="planting_delete"
      >
        {t('plantings:delete')}
      </SimpleButton>
    </div>
  );
}
