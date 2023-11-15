import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';
import { z } from 'zod';
import { PlantingDto } from '@/api_types/definitions';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import { DebouncedSimpleFormInput } from '@/components/Form/DebouncedSimpleFormInput';
import { useFindPlantById } from '@/features/map_planning/layers/plant/hooks/plantHookApi';
import { PlantNameFromAdditionalNameAndPlant, PlantNameFromPlant } from '@/utils/plant-naming';
import { calculatePlantCount, getPlantWidth } from '../util';

const PlantingAttributeEditFormSchema = z
  // The 'empty' value for the API is undefined, so we need to transform the empty string to undefined
  .object({
    addDate: z.nullable(z.string()).transform((value) => value || undefined),
    removeDate: z.nullable(z.string()).transform((value) => value || undefined),
    sizeX: z.number().int().nullable(),
    sizeY: z.number().int().nullable(),
  })
  .refine((schema) => !schema.removeDate || !schema.addDate || schema.addDate < schema.removeDate, {
    path: ['dateRelation'],
  });

export type PlantingFormData = Pick<PlantingDto, 'addDate' | 'removeDate' | 'sizeX' | 'sizeY'>;

export type EditPlantingAttributesProps = {
  onAddDateChange: (formData: PlantingFormData) => void;
  onRemoveDateChange: (formData: PlantingFormData) => void;
  onWidthChange: (formData: PlantingFormData) => void;
  onHeightChange: (formData: PlantingFormData) => void;
  onDeleteClick: () => void;
  isReadOnlyMode: boolean;
};

export type SinglePlantingAttributeFormProps = EditPlantingAttributesProps & {
  planting: PlantingDto;
};

export type MultiplePlantingsAttributeFormProps = EditPlantingAttributesProps & {
  plantings: PlantingDto[];
};

export type PlantingAttributeEditFormProps = EditPlantingAttributesProps & {
  addDateDefaultValue: string;
  addDateShowDifferentValueWarning?: boolean;
  removeDateDefaultValue: string;
  widthDefaultValue: number | undefined;
  heightDefaultValue: number | undefined;
  planting: PlantingDto | null;
  areaOfPlantings: boolean;
};

export function SinglePlantingAttributeForm({
  planting,
  ...props
}: SinglePlantingAttributeFormProps) {
  const { plantId } = planting;
  const {
    data: plant,
    isLoading: plantSummaryIsLoading,
    isError: plantSummaryIsError,
  } = useFindPlantById({ plantId });

  if (plantSummaryIsLoading) return null;
  if (plantSummaryIsError) return null;

  return (
    <div className="flex flex-col gap-2 p-2">
      <h2>
        {planting.additionalName ? (
          <PlantNameFromAdditionalNameAndPlant
            additionalName={planting.additionalName}
            plant={plant}
          />
        ) : (
          <PlantNameFromPlant plant={plant} />
        )}
      </h2>

      <PlantingAttributeEditForm
        addDateDefaultValue={planting.addDate ?? ''}
        removeDateDefaultValue={planting.removeDate ?? ''}
        widthDefaultValue={planting.sizeX}
        heightDefaultValue={planting.sizeY}
        areaOfPlantings={planting.isArea}
        planting={planting}
        {...props}
      />
    </div>
  );
}

export function MultiplePlantingsAttributeForm({
  plantings,
  ...props
}: MultiplePlantingsAttributeFormProps) {
  const { t } = useTranslation(['plantings']);

  const areAllPlantingsAreas = plantings.every((planting) => planting.isArea);

  const getCommonAddDate = () => {
    const comparisonDate = plantings[0].addDate;
    const existsCommonDate = plantings.every((planting) => planting.addDate === comparisonDate);
    return existsCommonDate ? comparisonDate : '';
  };

  const multiplePlantingsHaveDifferentAddDate = () => {
    const comparisonDate = plantings[0].addDate;
    return plantings.some((planting) => planting.addDate !== comparisonDate);
  };

  const getCommonRemoveDate = () => {
    const comparisonDate = plantings[0].removeDate;
    const existsCommonDate = plantings.every((planting) => planting.removeDate === comparisonDate);
    return existsCommonDate ? comparisonDate : '';
  };

  const getCommonWidth = () => {
    const comparisonWidth = plantings[0].sizeX;
    const existsCommonWidth = plantings.every((planting) => planting.sizeY === comparisonWidth);
    return existsCommonWidth ? comparisonWidth : undefined;
  };

  const getCommonHeight = () => {
    const comparisonHeight = plantings[0].sizeX;
    const existsCommonHeight = plantings.every((planting) => planting.sizeY === comparisonHeight);
    return existsCommonHeight ? comparisonHeight : undefined;
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <h2>{t('plantings:heading_multiple_plantings')}</h2>

      <PlantingAttributeEditForm
        addDateDefaultValue={getCommonAddDate() ?? ''}
        addDateShowDifferentValueWarning={multiplePlantingsHaveDifferentAddDate()}
        removeDateDefaultValue={getCommonRemoveDate() ?? ''}
        widthDefaultValue={getCommonWidth()}
        heightDefaultValue={getCommonHeight()}
        planting={null}
        areaOfPlantings={areAllPlantingsAreas}
        {...props}
      />
    </div>
  );
}

function PlantingAttributeEditForm({
  widthDefaultValue,
  heightDefaultValue,
  addDateDefaultValue,
  addDateShowDifferentValueWarning = false,
  removeDateDefaultValue,
  onWidthChange,
  onHeightChange,
  onAddDateChange,
  onRemoveDateChange,
  onPlantingNotesChange,
  onDeleteClick,
  isReadOnlyMode,
  areaOfPlantings,
  planting,
}: PlantingAttributeEditFormProps) {
  const { t } = useTranslation(['plantings']);
  const multiplePlantings = planting === null;

  const formInfo = useForm<PlantingFormData>({
    // The 'empty' value for the native date input is an empty string, not null | undefined
    defaultValues: {
      sizeX: widthDefaultValue,
      sizeY: heightDefaultValue,
      addDate: addDateDefaultValue,
      removeDate: removeDateDefaultValue,
      plantingNotes: plantingNotesDefaultValue,
    },
    resolver: zodResolver(PlantingAttributeEditFormSchema),
  });

  const { data: plant } = useFindPlantById({
    plantId: planting?.plantId ?? 0,
    enabled: !multiplePlantings,
  });

  const individualPlantSize = plant ? getPlantWidth(plant) : undefined;
  const plantCountInfo =
    planting && individualPlantSize
      ? calculatePlantCount(individualPlantSize, planting.sizeX, planting.sizeY)
      : null;

  const plantingNotesSubmitState = useDebouncedSubmit<PlantingAttribute>(
    watch('plantingNotes'),
    handleSubmit,
    onPlantingNotesChange,
  );

  return (
    <FormProvider {...formInfo}>
      {/**
       * See https://github.com/orgs/react-hook-form/discussions/7111
       * @ts-expect-error this error path was added by zod refine(). hook form is unaware, which is a shortcoming.*/}
      {formInfo.formState.errors.dateRelation && (
        <div className="text-sm text-red-400">{t('plantings:error_invalid_add_remove_date')}</div>
      )}

      {areaOfPlantings && (
        <div className="py-2">
          <h3>Area of Plantings</h3>

          {plantCountInfo && (
            <div className="grid grid-cols-[2fr_1fr] grid-rows-3 gap-y-2 py-2 text-sm">
              <span className="font-medium">
                {t('plantings:area_of_plantings.individual_plant_size')}
              </span>
              <span className="text-neutral-500">{individualPlantSize}</span>
              <span className="font-medium">{t('plantings:area_of_plantings.plants_per_row')}</span>
              <span className="text-neutral-500">{plantCountInfo.perRow}</span>
              <span className="font-medium">{t('plantings:area_of_plantings.number_of_rows')}</span>
              <span className="text-neutral-500">{plantCountInfo.perColumn}</span>
              <span className="font-medium">{t('plantings:area_of_plantings.total_plants')}</span>
              <span className="text-neutral-500">{plantCountInfo.total}</span>
            </div>
          )}
          <DebouncedSimpleFormInput
            onValid={onWidthChange}
            type="number"
            id="sizeX"
            data-testid="planting-attribute-edit-form__size-x"
            disabled={isReadOnlyMode}
            labelContent={t('plantings:width')}
            className="w-36"
          />

          <DebouncedSimpleFormInput
            onValid={onHeightChange}
            type="number"
            id="sizeY"
            data-testid="planting-attribute-edit-form__size-y"
            disabled={isReadOnlyMode}
            labelContent={t('plantings:height')}
            className="w-36"
          />
          <hr className="my-4 border-neutral-700" />
        </div>
      )}

      <DebouncedSimpleFormInput
        onValid={onAddDateChange}
        type="date"
        id="addDate"
        data-testid="planting-attribute-edit-form__add-date"
        disabled={isReadOnlyMode}
        labelContent={t('plantings:add_date')}
        className="w-36"
      />
      <p className="pb-4 text-[0.8rem] text-neutral-400">
        {multiplePlantings
          ? t('plantings:add_date_description_multiple_plantings')
          : t('plantings:add_date_description')}
      </p>

      <DebouncedSimpleFormInput
        onValid={onRemoveDateChange}
        type="date"
        id="removeDate"
        data-testid="planting-attribute-edit-form__removed-date"
        disabled={isReadOnlyMode}
        labelContent={t('plantings:remove_date')}
        className="w-36"
      />
      <p className="text-[0.8rem] text-neutral-400">
        {multiplePlantings
          ? t('plantings:remove_date_description_multiple_plantings')
          : t('plantings:remove_date_description')}
      </p>

      <div className="flex gap-2">
        <MarkdownEditor
          id="plantingNotes"
          aria-invalid={plantingNotesSubmitState === 'error'}
          labelText={t('plantings:notes')}
          className="w-46"
          onChange={(value) => {
            //setValue('plantingNotes', value);
            plantingNotesRef.current = value;
          }}
          value={plantingNotesRef.current}
          preview="edit"
          hiddenCommands={[undefined]}
        />
        {plantingNotesSubmitState === 'loading' && (
          <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
        )}
        {plantingNotesSubmitState === 'idle' && (
          <CheckIcon className="mb-3 mt-auto h-5 w-5 text-primary-400" />
        )}
        {plantingNotesShowDifferentValueWarning && <MultiplePlantingsDifferentValueAlert />}
      </div>

      <hr className="my-4 border-neutral-700" />

      <SimpleButton
        disabled={isReadOnlyMode}
        variant={ButtonVariant.dangerBase}
        onClick={onDeleteClick}
        className="w-36"
        data-tourid="planting_delete"
      >
        {multiplePlantings ? t('plantings:delete_multiple_plantings') : t('plantings:delete')}
      </SimpleButton>
    </FormProvider>
  );
}

export function MultiplePlantingsDifferentValueAlert() {
  const { t } = useTranslation(['plantings']);
  return (
    <>
      <AlertIcon
        data-tooltip-id="multiple-plantings-different-value-alert"
        data-tooltip-content={t('plantings:multiple_plantings_different_value_alert')}
        className="mb-3 mt-auto h-5 w-5 text-orange-400"
      />
      <Tooltip id="multiple-plantings-different-value-alert" />
    </>
  );
}
