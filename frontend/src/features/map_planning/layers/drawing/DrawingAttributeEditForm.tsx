import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { DrawingDto, DrawingShapeType } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import { DebouncedFillPatternSelector } from '@/components/Form/DebouncedFillPatternSelector';
import { DebouncedSimpleFormInput } from '@/components/Form/DebouncedSimpleFormInput';
import { DebouncedSimpleFormTextArea } from '@/components/Form/DebouncedSimpleFormTextArea';
import EditIcon from '@/svg/icons/edit.svg?react';
import EraserIcon from '@/svg/icons/eraser.svg?react';
import PencilPlusIcon from '@/svg/icons/pencil-plus.svg?react';
import useMapStore from '../../store/MapStore';
import { DrawingLayerStatusPanelContent } from './DrawingLayerStatusPanelContent';

const DrawingAttributeEditFormSchema = z
  // The 'empty' value for the API is undefined, so we need to transform the empty string to undefined
  .object({
    addDate: z.nullable(z.string()).transform((value) => value || undefined),
    removeDate: z.nullable(z.string()).transform((value) => value || undefined),
    text: z.nullable(z.string()).transform((value) => value || undefined),
    color: z.nullable(z.string()).transform((value) => value || undefined),
    strokeWidth: z.number().optional().nullable(),
    fillPattern: z
      .nullable(z.string())
      .optional()
      .transform((value) => value || undefined),
  })
  .refine((schema) => !schema.removeDate || !schema.addDate || schema.addDate < schema.removeDate, {
    path: ['dateRelation'],
  });

export type EditDrawingAttributesProps = {
  onAddDateChange: (addDate: DrawingFormData) => void;
  onRemoveDateChange: (removeDate: DrawingFormData) => void;
  onColorChange: (color: DrawingFormData) => void;
  onTextChange: (text: DrawingFormData) => void;
  onStrokeWidthChange: (strokeWidth: DrawingFormData) => void;
  onFillPatternChange: (fillPattern: DrawingFormData) => void;
  onDeleteClick: () => void;
  isReadOnlyMode: boolean;
};

export type DrawingFormData =
  | Pick<DrawingDto, 'addDate' | 'removeDate' | 'scaleX' | 'scaleY'> & {
      color?: string;
      strokeWidth?: number;
      fillPattern?: string;
      text?: string;
    };

export type DrawingFormInput = {
  id: string;
  type: DrawingShapeType;
  addDate?: string;
  removeDate?: string;
  color?: string;
  strokeWidth?: number;
  fillPattern?: string;
  text?: string;
};

export type EditSingleDrawingProps = EditDrawingAttributesProps & {
  drawing: DrawingFormInput;
};

export type EditMultipleDrawingsProps = EditDrawingAttributesProps & {
  drawings: DrawingFormInput[];
};

export type DrawingAttributeEditFormProps = EditDrawingAttributesProps & {
  drawingId?: string;
  addDateDefaultValue: string;
  removeDateDefaultValue: string;
  colorDefaultValue?: string;
  textDefaultValue?: string;
  strokeWidthDefaultValue?: number;
  fillPatternDefaultValue?: string;
  multipleDrawings?: boolean;
  showShapeEditButton: boolean;
  showColor: boolean;
  showStrokeWidth: boolean;
  showFillPattern: boolean;
  showText: boolean;
};

export function SingleDrawingAttributeForm({
  drawing,
  onAddDateChange,
  onRemoveDateChange,
  onDeleteClick,
  onColorChange,
  onTextChange,
  onStrokeWidthChange,
  onFillPatternChange,
  isReadOnlyMode,
}: EditSingleDrawingProps) {
  return (
    <div className="flex flex-col gap-2 p-2">
      <DrawingAttributeEditForm
        addDateDefaultValue={drawing.addDate ?? ''}
        removeDateDefaultValue={drawing.removeDate ?? ''}
        colorDefaultValue={drawing.color ?? ''}
        strokeWidthDefaultValue={drawing.strokeWidth ?? 0}
        fillPatternDefaultValue={drawing.fillPattern}
        textDefaultValue={drawing.text}
        onAddDateChange={onAddDateChange}
        onRemoveDateChange={onRemoveDateChange}
        onDeleteClick={onDeleteClick}
        onColorChange={onColorChange}
        onTextChange={onTextChange}
        showColor={drawing.color !== undefined}
        showStrokeWidth={drawing.strokeWidth !== undefined}
        showFillPattern={drawing.fillPattern !== undefined}
        showText={drawing.type === DrawingShapeType.LabelText}
        onStrokeWidthChange={onStrokeWidthChange}
        onFillPatternChange={onFillPatternChange}
        isReadOnlyMode={isReadOnlyMode}
        drawingId={drawing.id}
        showShapeEditButton={drawing.type === DrawingShapeType.BezierPolygon}
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
  onFillPatternChange,
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

  const hasAnyShapeColor = drawings.some((drawing) => drawing.color !== undefined);
  const hasAnyShapeStrokeWidth = drawings.some((drawing) => drawing.strokeWidth !== undefined);
  const hasAnyShapeFillPattern = drawings.some((drawing) => drawing.fillPattern !== undefined);

  const getCommonColor = () => {
    const color = drawings[0].color;
    const existsCommonColor = drawings.every((drawing) => drawing.color === color);
    return existsCommonColor ? color : undefined;
  };

  const getCommonText = () => {
    const text = drawings[0].text;
    const existsCommonText = drawings.every((drawing) => drawing.text === text);
    return existsCommonText ? text : undefined;
  };

  const getCommonStrokeWidth = () => {
    const strokeWidth = drawings[0].strokeWidth;

    const existsCommonStrokeWidth = drawings.every(
      (drawing) => drawing.strokeWidth === strokeWidth,
    );

    return existsCommonStrokeWidth ? strokeWidth : undefined;
  };

  const getCommonFillPattern = () => {
    const fillPattern = drawings[0].fillPattern;
    const existsCommonFillPattern = drawings.every(
      (drawing) => drawing.fillPattern === fillPattern,
    );

    return existsCommonFillPattern ? fillPattern : undefined;
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <DrawingAttributeEditForm
        addDateDefaultValue={getCommonAddDate() ?? ''}
        removeDateDefaultValue={getCommonRemoveDate() ?? ''}
        colorDefaultValue={getCommonColor()}
        strokeWidthDefaultValue={getCommonStrokeWidth()}
        fillPatternDefaultValue={getCommonFillPattern()}
        textDefaultValue={getCommonText()}
        onAddDateChange={onAddDateChange}
        onRemoveDateChange={onRemoveDateChange}
        onDeleteClick={onDeleteClick}
        onColorChange={onColorChange}
        onTextChange={onColorChange}
        showColor={hasAnyShapeColor}
        showStrokeWidth={hasAnyShapeStrokeWidth}
        showFillPattern={hasAnyShapeFillPattern}
        showText={drawings.every((drawing) => drawing.type === DrawingShapeType.LabelText)}
        onStrokeWidthChange={onStrokeWidthChange}
        onFillPatternChange={onFillPatternChange}
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
  textDefaultValue,
  strokeWidthDefaultValue,
  fillPatternDefaultValue,
  onAddDateChange,
  onRemoveDateChange,
  onDeleteClick,
  onColorChange,
  onTextChange,
  onStrokeWidthChange,
  onFillPatternChange,
  isReadOnlyMode,
  multipleDrawings = false,
  showShapeEditButton,
  showColor,
  showStrokeWidth,
  showFillPattern,
  showText,
}: DrawingAttributeEditFormProps) {
  const { t } = useTranslation(['drawings']);

  const formInfo = useForm<DrawingFormData>({
    defaultValues: {
      addDate: addDateDefaultValue,
      removeDate: removeDateDefaultValue,
      text: textDefaultValue ?? '',
      color: colorDefaultValue ?? '',
      strokeWidth: strokeWidthDefaultValue ?? 0,
      fillPattern: fillPatternDefaultValue,
    },
    resolver: zodResolver(DrawingAttributeEditFormSchema),
  });

  const showProperties = showStrokeWidth || showFillPattern || showColor;

  const drawingLayerSetEditMode = useMapStore((state) => state.drawingLayerSetEditMode);
  const editMode = useMapStore((state) => state.untrackedState.layers.drawing.editMode);

  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);

  useEffect(() => {
    formInfo.reset({
      addDate: addDateDefaultValue,
      removeDate: removeDateDefaultValue,
      color: colorDefaultValue ?? '',
      text: textDefaultValue ?? '',
      strokeWidth: strokeWidthDefaultValue ?? 0,
      fillPattern: fillPatternDefaultValue,
    });
  }, [
    addDateDefaultValue,
    removeDateDefaultValue,
    colorDefaultValue,
    textDefaultValue,
    strokeWidthDefaultValue,
    fillPatternDefaultValue,
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

      {showProperties && <hr className="my-4 border-neutral-700" />}

      {showText && (
        <div className="flex gap-2">
          <DebouncedSimpleFormTextArea
            id="text"
            type="text"
            labelText={t('drawings:text')}
            className="h-32 w-36"
            disabled={isReadOnlyMode}
            onValid={onTextChange}
          />
        </div>
      )}

      {showColor && (
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
      )}

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

      {showFillPattern && (
        <div className="flex gap-2">
          <DebouncedFillPatternSelector
            id="fillPattern"
            onValid={onFillPatternChange}
            labelContent={t('drawings:fillPattern')}
          />
        </div>
      )}

      {showShapeEditButton && drawingId && (
        <div>
          <hr className="my-6 border-neutral-700" />
          <label className="mb-2 block text-sm font-medium">{t('drawings:operations')}</label>
          <IconButton
            isToolboxIcon={true}
            renderAsActive={editMode === 'draw'}
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
            renderAsActive={editMode === 'add'}
            onClick={() => {
              drawingLayerSetEditMode(drawingId, 'add');
              setStatusPanelContent(
                <DrawingLayerStatusPanelContent
                  text={t('drawings:bezier_polygon_add_points_between_hint')}
                />,
              );
            }}
            title={t('drawings:bezier_polygon_add_points_between_tooltip')}
          >
            <PencilPlusIcon></PencilPlusIcon>
          </IconButton>

          <IconButton
            isToolboxIcon={true}
            renderAsActive={editMode === 'remove'}
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
