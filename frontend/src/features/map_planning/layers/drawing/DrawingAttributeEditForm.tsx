import { DrawingDto } from './types';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { useDebouncedSubmit } from '@/hooks/useDebouncedSubmit';
import CheckIcon from '@/svg/icons/check.svg?react';
import CircleDottedIcon from '@/svg/icons/circle-dotted.svg?react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const DrawingAttributeEditFormSchema = z
  // The 'empty' value for the API is undefined, so we need to transform the empty string to undefined
  .object({
    addDate: z.nullable(z.string()).transform((value) => value || undefined),
    removeDate: z.nullable(z.string()).transform((value) => value || undefined),
    color: z.string(),
  })
  .refine((schema) => !schema.removeDate || !schema.addDate || schema.addDate < schema.removeDate, {
    path: ['dateRelation'],
  });

export type DrawingDateAttribute = Pick<DrawingDto, 'addDate' | 'removeDate'>;
export type DrawingColorAttribute = { color: string };

export type EditDrawingAttributesProps = {
  onAddDateChange: (addDate: DrawingDateAttribute) => void;
  onRemoveDateChange: (removeDate: DrawingDateAttribute) => void;
  onColorChange: (color: DrawingColorAttribute) => void;
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
  multipleDrawings?: boolean;
};

export function SingleDrawingAttributeForm({
  drawing,
  onAddDateChange,
  onRemoveDateChange,
  onDeleteClick,
  onColorChange,
  isReadOnlyMode,
}: EditSingleDrawingProps) {
  return (
    <div className="flex flex-col gap-2 p-2">
      <DrawingAttributeEditForm
        addDateDefaultValue={drawing.addDate ?? ''}
        removeDateDefaultValue={drawing.removeDate ?? ''}
        colorDefaultValue={drawing.color ?? ''}
        onAddDateChange={onAddDateChange}
        onRemoveDateChange={onRemoveDateChange}
        onDeleteClick={onDeleteClick}
        onColorChange={onColorChange}
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

  return (
    <div className="flex flex-col gap-2 p-2">
      <DrawingAttributeEditForm
        addDateDefaultValue={getCommonAddDate() ?? ''}
        removeDateDefaultValue={getCommonRemoveDate() ?? ''}
        colorDefaultValue={getCommonColor()}
        onAddDateChange={onAddDateChange}
        onRemoveDateChange={onRemoveDateChange}
        onDeleteClick={onDeleteClick}
        onColorChange={onColorChange}
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
  onAddDateChange,
  onRemoveDateChange,
  onDeleteClick,
  onColorChange,
  isReadOnlyMode,
  multipleDrawings = false,
}: DrawingAttributeEditFormProps) {
  const { t } = useTranslation(['drawings']);

  const { register, handleSubmit, watch, formState } = useForm<
    DrawingDateAttribute & DrawingColorAttribute
  >({
    // The 'empty' value for the native date input is an empty string, not null | undefined
    defaultValues: {
      addDate: addDateDefaultValue,
      removeDate: removeDateDefaultValue,
      color: colorDefaultValue,
    },
    resolver: zodResolver(DrawingAttributeEditFormSchema),
  });

  const colorSubmitState = useDebouncedSubmit<DrawingColorAttribute>(
    watch('color'),
    handleSubmit,
    onColorChange,
  );

  const addDateSubmitState = useDebouncedSubmit<DrawingDateAttribute>(
    watch('addDate'),
    handleSubmit,
    onAddDateChange,
  );

  const removeDateSubmitState = useDebouncedSubmit<DrawingDateAttribute>(
    watch('removeDate'),
    handleSubmit,
    onRemoveDateChange,
  );

  return (
    <>
      {/**
       * See https://github.com/orgs/react-hook-form/discussions/7111
       * @ts-expect-error this error path was added by zod refine(). hook form is unaware, which is a shortcoming.*/}
      {formState.errors.dateRelation && (
        <div className="text-sm text-red-400">{t('drawings:error_invalid_add_remove_date')}</div>
      )}
      <div className="flex gap-2">
        <SimpleFormInput
          type="date"
          id="addDate"
          disabled={isReadOnlyMode}
          aria-invalid={addDateSubmitState === 'error'}
          labelContent={t('drawings:add_date')}
          register={register}
          className="w-36"
        />
        {addDateSubmitState === 'loading' && (
          <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
        )}
        {addDateSubmitState === 'idle' && (
          <CheckIcon
            className="mb-3 mt-auto h-5 w-5 text-primary-400"
            data-testid="drawing-attribute-edit-form__add-date-idle"
          />
        )}
      </div>

      <div className="flex gap-2">
        <SimpleFormInput
          type="date"
          id="removeDate"
          disabled={isReadOnlyMode}
          aria-invalid={removeDateSubmitState === 'error'}
          labelContent={t('drawings:remove_date')}
          register={register}
          className="w-36"
        />
        {removeDateSubmitState === 'loading' && (
          <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
        )}
        {removeDateSubmitState === 'idle' && (
          <CheckIcon
            className="mb-3 mt-auto h-5 w-5 text-primary-400"
            data-testid="drawing-attribute-edit-form__remove-date-idle"
          />
        )}
      </div>

      <hr className="my-4 border-neutral-700" />

      <div className="flex gap-2">
        <SimpleFormInput
          id="color"
          type="color"
          labelContent={t('drawings:color')}
          aria-invalid={colorSubmitState === 'error'}
          className="w-36"
          disabled={isReadOnlyMode}
          register={register}
        />
        {colorSubmitState === 'loading' && (
          <CircleDottedIcon className="mb-3 mt-auto h-5 w-5 animate-spin text-secondary-400" />
        )}
        {colorSubmitState === 'idle' && (
          <CheckIcon
            className="mb-3 mt-auto h-5 w-5 text-primary-400"
            data-testid="drawing-attribute-edit-form__color-idle"
          />
        )}
      </div>

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
    </>
  );
}

export default DrawingAttributeEditForm;
