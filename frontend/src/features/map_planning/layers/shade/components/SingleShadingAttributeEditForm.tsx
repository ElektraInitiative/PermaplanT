import { Shade, ShadingDto } from '@/api_types/definitions';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import SelectMenu from '@/components/Form/SelectMenu';
import { SelectOption } from '@/components/Form/SelectMenuTypes';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import {
  DeleteShadingAction,
  UpdateShadingAction,
  UpdateShadingAddDateAction,
  UpdateShadingRemoveDateAction,
} from '@/features/map_planning/layers/shade/actions';
import { ShadingGeometryToolForm } from '@/features/map_planning/layers/shade/components/ShadingGeometryToolForm';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useIsReadOnlyMode } from '@/features/map_planning/utils/ReadOnlyModeContext';
import { useDebouncedSubmit } from '@/hooks/useDebouncedSubmit';
import CheckIcon from '@/svg/icons/check.svg?react';
import CircleDottedIcon from '@/svg/icons/circle-dotted.svg?react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const ShadingAttributeEditFormSchema = z
  // The 'empty' value for the API is undefined, so we need to transform the empty string to undefined
  .object({
    addDate: z.nullable(z.string()).transform((value) => value || undefined),
    removeDate: z.nullable(z.string()).transform((value) => value || undefined),
    shade: z.string(),
  })
  .refine((schema) => !schema.removeDate || !schema.addDate || schema.addDate < schema.removeDate, {
    path: ['dateRelation'],
  });

export type ShadingDateAttribute = Pick<ShadingDto, 'addDate' | 'removeDate' | 'shade'>;

export interface SingleShadingAttributeEditFormProps {
  shading: ShadingDto;
}

export function SingleShadingAttributeEditForm({ shading }: SingleShadingAttributeEditFormProps) {
  const { t } = useTranslation('shadeLayer');
  const isReadOnlyMode = useIsReadOnlyMode();
  const executeAction = useMapStore((store) => store.executeAction);

  const formFunctions = useForm<ShadingDateAttribute>({
    defaultValues: {
      addDate: shading.addDate,
      removeDate: shading.removeDate,
    },
    resolver: zodResolver(ShadingAttributeEditFormSchema),
  });

  const shadeOptions: Array<SelectOption> = [
    { value: Shade.LightShade, label: t('shading_amount.light_shade') },
    { value: Shade.PartialShade, label: t('shading_amount.partial_shade') },
    { value: Shade.PermanentShade, label: t('shading_amount.permanent_shade') },
    { value: Shade.PermanentDeepShade, label: t('shading_amount.permanent_deep_shade') },
  ];

  useEffect(() => {
    formFunctions.setValue('addDate', shading.addDate, {
      shouldDirty: false,
      shouldTouch: false,
    });
    formFunctions.setValue('removeDate', shading.removeDate, {
      shouldDirty: false,
      shouldTouch: false,
    });
    formFunctions.setValue('shade', shading.shade);
  }, [shading]); // eslint-disable-line react-hooks/exhaustive-deps

  const onAddDateChange = ({ addDate }: ShadingDateAttribute) => {
    executeAction(
      new UpdateShadingAddDateAction({
        addDate: addDate,
        id: shading.id,
      }),
    );
  };

  const onRemoveDateChange = ({ removeDate }: ShadingDateAttribute) => {
    executeAction(
      new UpdateShadingRemoveDateAction({
        removeDate: removeDate,
        id: shading.id,
      }),
    );
  };

  const onShadeChange = ({ shade }: ShadingDateAttribute) => {
    executeAction(
      new UpdateShadingAction({
        shade: shade,
        id: shading.id,
        geometry: shading.geometry,
      }),
    );
  };

  const deleteShading = () => {
    executeAction(new DeleteShadingAction(shading));
  };

  const shadeSubmitState = useDebouncedSubmit<ShadingDateAttribute>(
    formFunctions.watch('shade'),
    formFunctions.handleSubmit,
    onShadeChange,
  );

  const addDateSubmitState = useDebouncedSubmit<ShadingDateAttribute>(
    formFunctions.watch('addDate'),
    formFunctions.handleSubmit,
    onAddDateChange,
  );

  const removeDateSubmitState = useDebouncedSubmit<ShadingDateAttribute>(
    formFunctions.watch('removeDate'),
    formFunctions.handleSubmit,
    onRemoveDateChange,
  );

  return (
    <div className="flex flex-col gap-2 p-2">
      <FormProvider {...formFunctions}>
        <SelectMenu
          id="shade"
          labelText={t('left_toolbar.shading_amount_select_title')}
          className="w-64"
          disabled={isReadOnlyMode}
          options={shadeOptions}
          optionFromValue={(value) => shadeOptions.find((o) => o.value === value)}
          valueFromOption={(option) => option?.value ?? Shade.LightShade}
        />
      </FormProvider>
      {shadeSubmitState === 'loading' && (
        <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
      )}
      {shadeSubmitState === 'idle' && (
        <CheckIcon
          className="mb-3 mt-auto h-5 w-5 text-primary-400"
          data-testid="planting-attribute-edit-form__add-date-idle"
        />
      )}
      <hr className="my-4 border-neutral-700" />

      <ShadingGeometryToolForm />

      <hr className="my-4 border-neutral-700" />

      <div className="flex gap-2">
        <SimpleFormInput
          type="date"
          id="addDate"
          disabled={isReadOnlyMode}
          labelContent={t('left_toolbar.add_date')}
          register={formFunctions.register}
          className="w-36"
        />
        {addDateSubmitState === 'loading' && (
          <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
        )}
        {addDateSubmitState === 'idle' && (
          <CheckIcon
            className="mb-3 mt-auto h-5 w-5 text-primary-400"
            data-testid="planting-attribute-edit-form__add-date-idle"
          />
        )}
      </div>

      <div className="flex gap-2">
        <SimpleFormInput
          type="date"
          id="removeDate"
          disabled={isReadOnlyMode}
          labelContent={t('left_toolbar.remove_date')}
          register={formFunctions.register}
          className="w-36"
        />
        {removeDateSubmitState === 'loading' && (
          <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
        )}
        {removeDateSubmitState === 'idle' && (
          <CheckIcon
            className="mb-3 mt-auto h-5 w-5 text-primary-400"
            data-testid="planting-attribute-edit-form__add-date-idle"
          />
        )}
      </div>

      <hr className="my-4 border-neutral-700" />

      <SimpleButton
        variant={ButtonVariant.dangerBase}
        onClick={deleteShading}
        disabled={isReadOnlyMode}
        className="top-5 w-44"
      >
        {t('left_toolbar.delete_button')}
      </SimpleButton>
    </div>
  );
}
