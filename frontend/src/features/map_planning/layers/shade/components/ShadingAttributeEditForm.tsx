import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Shade, ShadingDto } from '@/api_types/definitions';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import SelectMenu from '@/components/Form/SelectMenu';
import { SelectOption } from '@/components/Form/SelectMenuTypes';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { ShadingGeometryToolForm } from '@/features/map_planning/layers/shade/components/ShadingGeometryToolForm';
import { useIsReadOnlyMode } from '@/features/map_planning/utils/ReadOnlyModeContext';
import { useDebouncedSubmit } from '@/hooks/useDebouncedSubmit';
import CheckIcon from '@/svg/icons/check.svg?react';
import CircleDottedIcon from '@/svg/icons/circle-dotted.svg?react';

const ShadingAttributeEditFormSchema = z
  // The 'empty' value for the API is undefined, so we need to transform the empty string to undefined
  .object({
    addDate: z.nullable(z.string()).transform((value) => value || undefined),
    removeDate: z.nullable(z.string()).transform((value) => value || undefined),
    shade: z.nullable(z.string()).transform((value) => value || undefined),
  })
  .refine((schema) => !schema.removeDate || !schema.addDate || schema.addDate < schema.removeDate, {
    path: ['dateRelation'],
  });

export type ShadingCoreDataAttribute = Pick<ShadingDto, 'addDate' | 'removeDate'> & {
  shade: Shade | undefined;
};

interface EditShadingAttributesProps {
  onAddDateChange: ({ addDate }: ShadingCoreDataAttribute) => void;
  onRemoveDateChange: ({ removeDate }: ShadingCoreDataAttribute) => void;
  onShadeChange: ({ shade }: ShadingCoreDataAttribute) => void;
  onDeleteShading: () => void;
}

export type SingleShadingAttributeEditFormProps = EditShadingAttributesProps & {
  shading: ShadingDto;
};

export type MultipleShadingAttributeEditFormProps = EditShadingAttributesProps & {
  shadings: ShadingDto[];
};

export type ShadingAttributeEditFormProps = EditShadingAttributesProps & {
  showPolygonTools: boolean;
  addDate: string;
  removeDate: string;
  shade: Shade;
};

export function SingleShadingAttributeEditFrom({
  shading,
  onAddDateChange,
  onRemoveDateChange,
  onShadeChange,
  onDeleteShading,
}: SingleShadingAttributeEditFormProps) {
  return (
    <ShadingAttributeEditForm
      shade={shading.shade}
      showPolygonTools={true}
      addDate={shading.addDate ?? ''}
      removeDate={shading.removeDate ?? ''}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onShadeChange={onShadeChange}
      onDeleteShading={onDeleteShading}
    />
  );
}

export function MultipleShadingAttributeEditFrom({
  shadings,
  onAddDateChange,
  onRemoveDateChange,
  onShadeChange,
  onDeleteShading,
}: MultipleShadingAttributeEditFormProps) {
  const getCommonShade = () => {
    const commonShade = shadings[0].shade;
    for (const shading of shadings) {
      if (shading.shade != commonShade) return undefined;
    }

    return commonShade;
  };

  const getCommonAddDate = () => {
    const commonAddDate = shadings[0].addDate;
    for (const shading of shadings) {
      if (shading.addDate != commonAddDate) return undefined;
    }

    return commonAddDate;
  };

  const getCommonRemoveDate = () => {
    const commonAddDate = shadings[0].removeDate;
    for (const shading of shadings) {
      if (shading.removeDate != commonAddDate) return undefined;
    }

    return commonAddDate;
  };

  return (
    <ShadingAttributeEditForm
      showPolygonTools={false}
      shade={getCommonShade() ?? Shade.LightShade}
      addDate={getCommonAddDate() ?? ''}
      removeDate={getCommonRemoveDate() ?? ''}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onShadeChange={onShadeChange}
      onDeleteShading={onDeleteShading}
    />
  );
}

function ShadingAttributeEditForm({
  onAddDateChange,
  onDeleteShading,
  onRemoveDateChange,
  onShadeChange,
  showPolygonTools,
  addDate,
  removeDate,
  shade,
}: ShadingAttributeEditFormProps) {
  const { t } = useTranslation('shadeLayer');
  const isReadOnlyMode = useIsReadOnlyMode();

  const formFunctions = useForm<ShadingCoreDataAttribute>({
    defaultValues: {
      shade,
      addDate,
      removeDate,
    },
    resolver: zodResolver(ShadingAttributeEditFormSchema),
  });

  const shadeOptions: Array<SelectOption> = [
    { value: Shade.LightShade, label: t('shading_amount.light_shade') },
    { value: Shade.PartialShade, label: t('shading_amount.partial_shade') },
    { value: Shade.PermanentShade, label: t('shading_amount.permanent_shade') },
    { value: Shade.PermanentDeepShade, label: t('shading_amount.permanent_deep_shade') },
  ];

  const shadeSubmitState = useDebouncedSubmit<ShadingCoreDataAttribute>(
    formFunctions.watch('shade'),
    formFunctions.handleSubmit,
    onShadeChange,
  );

  const addDateSubmitState = useDebouncedSubmit<ShadingCoreDataAttribute>(
    formFunctions.watch('addDate'),
    formFunctions.handleSubmit,
    onAddDateChange,
  );

  const removeDateSubmitState = useDebouncedSubmit<ShadingCoreDataAttribute>(
    formFunctions.watch('removeDate'),
    formFunctions.handleSubmit,
    onRemoveDateChange,
  );

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex gap-2">
        <FormProvider {...formFunctions}>
          <SelectMenu
            id="shade"
            labelText={t('left_toolbar.shading_amount_select_title')}
            className="w-64"
            disabled={isReadOnlyMode}
            options={shadeOptions}
            optionFromValue={(value) => shadeOptions.find((o) => o.value === value)}
            valueFromOption={(option) => option?.value}
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
      </div>

      {showPolygonTools && <ShadingGeometryToolForm />}

      {/**
       * See https://github.com/orgs/react-hook-form/discussions/7111
       * @ts-expect-error this error path was added by zod refine(). hook form is unaware, which is a shortcoming.*/}
      {formFunctions.formState.errors.dateRelation && (
        <div className="text-sm text-red-400">
          {t('left_toolbar.error_remove_date_before_add_date')}
        </div>
      )}
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
        onClick={onDeleteShading}
        disabled={isReadOnlyMode}
        className="top-5 w-44"
      >
        {t('left_toolbar.delete_button')}
      </SimpleButton>
    </div>
  );
}
