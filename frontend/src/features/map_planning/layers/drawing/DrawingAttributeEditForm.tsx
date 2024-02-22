import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import { DebouncedSimpleFormInput } from '@/components/Form/DebouncedSimpleFormInput';
import { DrawingDto } from './types';

const DrawingAttributeEditFormSchema = z
  // The 'empty' value for the API is undefined, so we need to transform the empty string to undefined
  .object({
    addDate: z.nullable(z.string()).transform((value) => value || undefined),
    removeDate: z.nullable(z.string()).transform((value) => value || undefined),
    color: z.string(),
    strokeWidth: z.number().nullable(),
  })
  .refine((schema) => !schema.removeDate || !schema.addDate || schema.addDate < schema.removeDate, {
    path: ['dateRelation'],
  });

export type EditDrawingAttributesProps = {
  onAddDateChange: (addDate: DrawingFormData) => void;
  onRemoveDateChange: (removeDate: DrawingFormData) => void;
  onColorChange: (color: DrawingFormData) => void;
  onStrokeWidthChange: (strokeWidth: DrawingFormData) => void;
  onDeleteClick: () => void;
  isReadOnlyMode: boolean;
};

export type EditSingleDrawingProps = EditDrawingAttributesProps & {
  drawing: DrawingDto;
};

export type EditMultipleDrawingsProps = EditDrawingAttributesProps & {
  drawings: DrawingDto[];
};

export type DrawingAttributeEditFormProps = EditDrawingAttributesProps & {
  addDateDefaultValue: string;
  removeDateDefaultValue: string;
  colorDefaultValue: string;
  strokeWidthDefaultValue?: number;
  multipleDrawings?: boolean;
};

export type DrawingFormData = Pick<
  DrawingDto,
  'addDate' | 'removeDate' | 'scaleX' | 'scaleY' | 'color' | 'strokeWidth'
>;

export function SingleDrawingAttributeForm({
  drawing,
  onAddDateChange,
  onRemoveDateChange,
  onDeleteClick,
  onColorChange,
  onStrokeWidthChange,
  isReadOnlyMode,
}: EditSingleDrawingProps) {
  return (
    <div className="flex flex-col gap-2 p-2">
      <DrawingAttributeEditForm
        addDateDefaultValue={drawing.addDate ?? ''}
        removeDateDefaultValue={drawing.removeDate ?? ''}
        colorDefaultValue={drawing.color ?? ''}
        strokeWidthDefaultValue={drawing.strokeWidth ?? 0}
        onAddDateChange={onAddDateChange}
        onRemoveDateChange={onRemoveDateChange}
        onDeleteClick={onDeleteClick}
        onColorChange={onColorChange}
        onStrokeWidthChange={onStrokeWidthChange}
        isReadOnlyMode={isReadOnlyMode}
      />
    </div>
  );
}

export function MultipleDrawingAttributeForm({
  drawings,
  onAddDateChange,
  onRemoveDateChange,
  onDeleteClick,
  onColorChange,
  onStrokeWidthChange,
  isReadOnlyMode,
}: EditMultipleDrawingsProps) {
  const getCommonAddDate = () => {
    const comparisonDate = drawings[0].addDate;
    const existsCommonDate = drawings.every((drawing) => drawing.addDate === comparisonDate);
    return existsCommonDate ? comparisonDate : '';
  };

  const getCommonRemoveDate = () => {
    const comparisonDate = drawings[0].removeDate;
    const existsCommonDate = drawings.every((drawing) => drawing.removeDate === comparisonDate);
    return existsCommonDate ? comparisonDate : '';
  };

  const getCommonColor = () => {
    const color = drawings[0].color;
    const existsCommonColor = drawings.every((drawing) => drawing.color === color);
    return existsCommonColor ? color : '#000000';
  };

  const getCommonStrokeWidth = () => {
    const strokeWidth = drawings[0].strokeWidth;
    const existsCommonStrokeWidth = drawings.every(
      (drawing) => drawing.strokeWidth === strokeWidth,
    );
    return existsCommonStrokeWidth ? strokeWidth : 0;
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <DrawingAttributeEditForm
        addDateDefaultValue={getCommonAddDate() ?? ''}
        removeDateDefaultValue={getCommonRemoveDate() ?? ''}
        colorDefaultValue={getCommonColor()}
        strokeWidthDefaultValue={getCommonStrokeWidth()}
        onAddDateChange={onAddDateChange}
        onRemoveDateChange={onRemoveDateChange}
        onDeleteClick={onDeleteClick}
        onColorChange={onColorChange}
        onStrokeWidthChange={onStrokeWidthChange}
        isReadOnlyMode={isReadOnlyMode}
        multipleDrawings={true}
      />
    </div>
  );
}

export function DrawingAttributeEditForm({
  addDateDefaultValue,
  removeDateDefaultValue,
  colorDefaultValue,
  strokeWidthDefaultValue,
  onAddDateChange,
  onRemoveDateChange,
  onDeleteClick,
  onColorChange,
  onStrokeWidthChange,
  isReadOnlyMode,
  multipleDrawings = false,
}: DrawingAttributeEditFormProps) {
  const { t } = useTranslation(['drawings']);

  const formInfo = useForm<DrawingFormData>({
    defaultValues: {
      addDate: addDateDefaultValue,
      removeDate: removeDateDefaultValue,
      color: colorDefaultValue,
      strokeWidth: strokeWidthDefaultValue,
    },
    resolver: zodResolver(DrawingAttributeEditFormSchema),
  });

  const showStrokeWidth = strokeWidthDefaultValue !== undefined && strokeWidthDefaultValue > 0;

  useEffect(() => {
    formInfo.reset({
      addDate: addDateDefaultValue,
      removeDate: removeDateDefaultValue,
      color: colorDefaultValue,
      strokeWidth: strokeWidthDefaultValue,
    });
  }, [
    addDateDefaultValue,
    removeDateDefaultValue,
    colorDefaultValue,
    strokeWidthDefaultValue,
    formInfo,
  ]);

  return (
    <FormProvider {...formInfo}>
      {/**
       * See https://github.com/orgs/react-hook-form/discussions/7111
       * @ts-expect-error this error path was added by zod refine(). hook form is unaware, which is a shortcoming.*/}
      {formInfo.formState.errors.dateRelation && (
        <div className="text-sm text-red-400">{t('drawings:error_invalid_add_remove_date')}</div>
      )}
      <div className="flex gap-2">
        <DebouncedSimpleFormInput
          type="date"
          id="addDate"
          disabled={isReadOnlyMode}
          labelContent={t('drawings:add_date')}
          className="w-36"
          onValid={onAddDateChange}
        />
      </div>

      <div className="flex gap-2">
        <DebouncedSimpleFormInput
          type="date"
          id="removeDate"
          disabled={isReadOnlyMode}
          labelContent={t('drawings:remove_date')}
          className="w-36"
          onValid={onRemoveDateChange}
        />
      </div>

      <hr className="my-4 border-neutral-700" />

      <div className="flex gap-2">
        <DebouncedSimpleFormInput
          id="color"
          type="color"
          labelContent={t('drawings:color')}
          className="w-36"
          disabled={isReadOnlyMode}
          onValid={onColorChange}
        />
      </div>

      {showStrokeWidth && (
        <div className="flex gap-2">
          <DebouncedSimpleFormInput
            required={false}
            id="strokeWidth"
            type="range"
            min={1}
            max={100}
            labelContent={t('drawings:strokeWidth')}
            className="w-36"
            disabled={isReadOnlyMode}
            onValid={onStrokeWidthChange}
            valueAsNumber={true}
          />
        </div>
      )}

      <hr className="my-4 border-neutral-700" />

      <SimpleButton
        disabled={isReadOnlyMode}
        variant={ButtonVariant.dangerBase}
        onClick={onDeleteClick}
        className="w-36"
        data-tourid="drawing_delete"
      >
        {multipleDrawings ? t('drawings:delete_multiple_drawings') : t('drawings:delete')}
      </SimpleButton>
    </FormProvider>
  );
}

export default DrawingAttributeEditForm;
