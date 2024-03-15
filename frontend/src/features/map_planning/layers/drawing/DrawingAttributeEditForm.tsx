import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { DrawingDto, DrawingShapeKind } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import { DebouncedSimpleFormInput } from '@/components/Form/DebouncedSimpleFormInput';
import EditIcon from '@/svg/icons/edit.svg?react';
import EraserIcon from '@/svg/icons/eraser.svg?react';
import useMapStore from '../../store/MapStore';
import { DrawingLayerStatusPanelContent } from './DrawingLayerStatusPanelContent';

const DrawingAttributeEditFormSchema = z
  // The 'empty' value for the API is undefined, so we need to transform the empty string to undefined
  .object({
    addDate: z.nullable(z.string()).transform((value) => value || undefined),
    removeDate: z.nullable(z.string()).transform((value) => value || undefined),
    color: z.string(),
    strokeWidth: z.number().nullable(),
    fillEnabled: z.boolean().nullable(),
  })
  .refine((schema) => !schema.removeDate || !schema.addDate || schema.addDate < schema.removeDate, {
    path: ['dateRelation'],
  });

export type EditDrawingAttributesProps = {
  onAddDateChange: (addDate: DrawingFormData) => void;
  onRemoveDateChange: (removeDate: DrawingFormData) => void;
  onColorChange: (color: DrawingFormData) => void;
  onStrokeWidthChange: (strokeWidth: DrawingFormData) => void;
  onFillEnabledChange: (fillEnabled: DrawingFormData) => void;
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
  drawingId?: string;
  addDateDefaultValue: string;
  removeDateDefaultValue: string;
  colorDefaultValue: string;
  strokeWidthDefaultValue?: number;
  fillEnabledDefaultValue?: boolean;
  multipleDrawings?: boolean;
  showShapeEditButton: boolean;
};

export type DrawingFormData = Pick<
  DrawingDto,
  'addDate' | 'removeDate' | 'scaleX' | 'scaleY' | 'color' | 'strokeWidth' | 'fillEnabled'
>;

export function SingleDrawingAttributeForm({
  drawing,
  onAddDateChange,
  onRemoveDateChange,
  onDeleteClick,
  onColorChange,
  onStrokeWidthChange,
  onFillEnabledChange,
  isReadOnlyMode,
}: EditSingleDrawingProps) {
  return (
    <div className="flex flex-col gap-2 p-2">
      <DrawingAttributeEditForm
        addDateDefaultValue={drawing.addDate ?? ''}
        removeDateDefaultValue={drawing.removeDate ?? ''}
        colorDefaultValue={drawing.color ?? ''}
        strokeWidthDefaultValue={drawing.strokeWidth ?? 0}
        fillEnabledDefaultValue={drawing.fillEnabled}
        onAddDateChange={onAddDateChange}
        onRemoveDateChange={onRemoveDateChange}
        onDeleteClick={onDeleteClick}
        onColorChange={onColorChange}
        onStrokeWidthChange={onStrokeWidthChange}
        onFillEnabledChange={onFillEnabledChange}
        isReadOnlyMode={isReadOnlyMode}
        drawingId={drawing.id}
        showShapeEditButton={drawing.kind === DrawingShapeKind.BezierPolygon}
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
  onFillEnabledChange,
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

  const getCommonFillEnabled = () => {
    const fillEnabled = drawings[0].fillEnabled;
    const existsCommonFillEnabled = drawings.every(
      (drawing) => drawing.fillEnabled === fillEnabled,
    );
    return existsCommonFillEnabled ? fillEnabled : false;
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <DrawingAttributeEditForm
        addDateDefaultValue={getCommonAddDate() ?? ''}
        removeDateDefaultValue={getCommonRemoveDate() ?? ''}
        colorDefaultValue={getCommonColor()}
        strokeWidthDefaultValue={getCommonStrokeWidth()}
        fillEnabledDefaultValue={getCommonFillEnabled()}
        onAddDateChange={onAddDateChange}
        onRemoveDateChange={onRemoveDateChange}
        onDeleteClick={onDeleteClick}
        onColorChange={onColorChange}
        onStrokeWidthChange={onStrokeWidthChange}
        onFillEnabledChange={onFillEnabledChange}
        isReadOnlyMode={isReadOnlyMode}
        multipleDrawings={true}
        showShapeEditButton={false}
      />
    </div>
  );
}

export function DrawingAttributeEditForm({
  drawingId,
  addDateDefaultValue,
  removeDateDefaultValue,
  colorDefaultValue,
  strokeWidthDefaultValue,
  fillEnabledDefaultValue,
  onAddDateChange,
  onRemoveDateChange,
  onDeleteClick,
  onColorChange,
  onStrokeWidthChange,
  onFillEnabledChange,
  isReadOnlyMode,
  multipleDrawings = false,
  showShapeEditButton,
}: DrawingAttributeEditFormProps) {
  const { t } = useTranslation(['drawings']);

  const formInfo = useForm<DrawingFormData>({
    defaultValues: {
      addDate: addDateDefaultValue,
      removeDate: removeDateDefaultValue,
      color: colorDefaultValue,
      strokeWidth: strokeWidthDefaultValue,
      fillEnabled: fillEnabledDefaultValue,
    },
    resolver: zodResolver(DrawingAttributeEditFormSchema),
  });

  const showStrokeWidth = strokeWidthDefaultValue !== undefined && strokeWidthDefaultValue > 0;
  const showFillEnabled = fillEnabledDefaultValue !== undefined;

  const drawingLayerSetEditMode = useMapStore((state) => state.drawingLayerSetEditMode);
  const editMode = useMapStore((state) => state.untrackedState.layers.drawing.editMode);

  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);

  useEffect(() => {
    formInfo.reset({
      addDate: addDateDefaultValue,
      removeDate: removeDateDefaultValue,
      color: colorDefaultValue,
      strokeWidth: strokeWidthDefaultValue,
      fillEnabled: fillEnabledDefaultValue,
    });
  }, [
    addDateDefaultValue,
    removeDateDefaultValue,
    colorDefaultValue,
    strokeWidthDefaultValue,
    fillEnabledDefaultValue,
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
        <div className="mt-2 flex gap-2">
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

      {showFillEnabled && (
        <div className="flex gap-2">
          <DebouncedSimpleFormInput
            id="fillEnabled"
            type="checkbox"
            labelContent={t('drawings:fillEnabled')}
            className="h-4 w-4"
            disabled={isReadOnlyMode}
            onValid={onFillEnabledChange}
          />
        </div>
      )}

      {showShapeEditButton && drawingId && (
        <div>
          <hr className="my-2 border-neutral-700" />
          <label className="mb-2 block text-sm font-medium">{t('drawings:operations')}</label>
          <IconButton
            isToolboxIcon={true}
            renderAsActive={editMode != undefined}
            onClick={() => {
              drawingLayerSetEditMode(drawingId, 'draw');
              setStatusPanelContent(
                <DrawingLayerStatusPanelContent text={t('drawings:edit_bezier_polygon_hint')} />,
              );
            }}
            title={t('drawings:edit_bezier_polygon_tooltip')}
          >
            <EditIcon></EditIcon>
          </IconButton>

          <IconButton
            isToolboxIcon={true}
            onClick={() => {
              drawingLayerSetEditMode(drawingId, 'remove');
              setStatusPanelContent(
                <DrawingLayerStatusPanelContent
                  text={t('drawings:delete_bezier_polygon_point_hint')}
                />,
              );
            }}
            title={t('drawings:delete_bezier_polygon_point_tooltip')}
          >
            <EraserIcon></EraserIcon>
          </IconButton>
        </div>
      )}

      <hr className="my-2 border-neutral-700" />

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
