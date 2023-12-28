import { Shade, ShadingDto } from '@/api_types/definitions';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import SelectMenu from '@/components/Form/SelectMenu';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { ShadingGeometryToolForm } from '@/features/map_planning/layers/shade/components/ShadingGeometryToolForm';
import { useIsReadOnlyMode } from '@/features/map_planning/utils/ReadOnlyModeContext';
import CheckIcon from '@/svg/icons/check.svg?react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export interface SingleShadingAttributeEditFormProps {
  shading: ShadingDto;
}

export function SingleShadingAttributeEditForm({ shading }: SingleShadingAttributeEditFormProps) {
  const { t } = useTranslation('shadeLayer');
  const isReadOnlyMode = useIsReadOnlyMode();
  const { register, control } = useForm();

  const shadeOptions = [
    { value: Shade.LightShade, label: t('shading_amount.light_shade') },
    { value: Shade.PartialShade, label: t('shading_amount.partial_shade') },
    { value: Shade.PermanentShade, label: t('shading_amount.permanent_shade') },
    { value: Shade.PermanentDeepShade, label: t('shading_amount.permanent_deep_shade') },
  ];

  /*
    const addDateSubmitState = useDebouncedSubmit<PlantingDateAttribute>(
        watch('addDate'),
        handleSubmit,
        onAddDateChange,
    );

    const removeDateSubmitState = useDebouncedSubmit<PlantingDateAttribute>(
        watch('removeDate'),
        handleSubmit,
        onRemoveDateChange,
    );
    */

  return (
    <div className="flex flex-col gap-2 p-2">
      <SelectMenu
        id="shadeAmount"
        labelText={t('left_toolbar.shading_amount_select_title')}
        className="w-64"
        control={control}
        value={shadeOptions.find((e) => e.value == shading.shade)}
        options={shadeOptions}
      />
      <hr className="my-4 border-neutral-700" />

      <ShadingGeometryToolForm />

      <hr className="my-4 border-neutral-700" />

      <div className="flex gap-2">
        <SimpleFormInput
          type="date"
          id="addDate"
          disabled={isReadOnlyMode}
          labelContent={t('left_toolbar.add_date')}
          register={register}
          className="w-36"
        />
        {/*(
              <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
          )*/}
        {
          <CheckIcon
            className="mb-3 mt-auto h-5 w-5 text-primary-400"
            data-testid="planting-attribute-edit-form__add-date-idle"
          />
        }
      </div>

      <div className="flex gap-2">
        <SimpleFormInput
          type="date"
          id="removeDate"
          disabled={isReadOnlyMode}
          labelContent={t('left_toolbar.remove_date')}
          register={register}
          className="w-36"
        />
        {/*(
              <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
          )*/}
        {
          <CheckIcon
            className="mb-3 mt-auto h-5 w-5 text-primary-400"
            data-testid="planting-attribute-edit-form__add-date-idle"
          />
        }
      </div>

      <hr className="my-4 border-neutral-700" />

      <SimpleButton variant={ButtonVariant.dangerBase} className="top-5 w-44">
        {t('left_toolbar.delete_button')}
      </SimpleButton>
    </div>
  );
}
