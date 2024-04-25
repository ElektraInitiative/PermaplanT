import { DrawingDto, DrawingShapeType } from '@/api_types/definitions';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useIsReadOnlyMode } from '../../utils/ReadOnlyModeContext';
import {
  DrawingFormData,
  DrawingFormInput as DrawingFormElement,
  MultipleDrawingAttributeForm,
  SingleDrawingAttributeForm,
} from './DrawingAttributeEditForm';
import {
  UpdateDrawingAddDateAction,
  UpdateDrawingAction,
  UpdateDrawingRemoveDateAction,
} from './actions';
import { useDeleteSelectedDrawings } from './hooks/useDeleteSelectedDrawings';

export function DrawingLayerLeftToolbar() {
  const selectedDrawings = useMapStore(
    (state) => state.untrackedState.layers.drawing.selectedDrawings,
  );

  const executeAction = useMapStore((state) => state.executeAction);
  const { deleteSelectedDrawings } = useDeleteSelectedDrawings();

  const isReadOnlyMode = useIsReadOnlyMode();

  const nothingSelected = !selectedDrawings?.length;
  const singeleDrawingSelected = selectedDrawings?.length === 1;

  const onAddDateChange = ({ addDate }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    const hasChanged = selectedDrawings.some(
      (selectedDrawing) => selectedDrawing.addDate !== addDate,
    );
    if (!hasChanged) return;

    executeAction(
      new UpdateDrawingAddDateAction(selectedDrawings.map((d) => ({ id: d.id, addDate }))),
    );
  };

  const onRemoveDateChange = ({ removeDate }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    const hasChanged = selectedDrawings.some(
      (selectedDrawing) => selectedDrawing.removeDate !== removeDate,
    );
    if (!hasChanged) return;

    executeAction(
      new UpdateDrawingRemoveDateAction(selectedDrawings.map((d) => ({ id: d.id, removeDate }))),
    );
  };

  const onColorChange = ({ color }: DrawingFormData) => {
    if (!selectedDrawings?.length || color === undefined) return;

    const hasChanged = selectedDrawings.some(
      (selectedDrawing) =>
        selectedDrawing.variant.type !== DrawingShapeType.Image &&
        selectedDrawing.variant.properties.color !== color,
    );
    if (!hasChanged) return;

    const updatedDrawings = selectedDrawings.map((selectedDrawing) => ({
      ...selectedDrawing,
      variant: {
        ...selectedDrawing.variant,
        properties: {
          ...selectedDrawing.variant.properties,
          color,
        },
      },
    })) as DrawingDto[];

    executeAction(new UpdateDrawingAction(updatedDrawings));
  };

  const onStrokeWidthChange = ({ strokeWidth }: DrawingFormData) => {
    if (!selectedDrawings?.length || strokeWidth === undefined || strokeWidth === 0) return;

    const hasChanged = selectedDrawings.some(
      (selectedDrawing) =>
        selectedDrawing.variant.type !== DrawingShapeType.Image &&
        selectedDrawing.variant.type !== DrawingShapeType.LabelText &&
        selectedDrawing.variant.properties.strokeWidth !== strokeWidth,
    );
    if (!hasChanged) return;

    const updatedDrawings = selectedDrawings.map((selectedDrawing) => ({
      ...selectedDrawing,
      variant: {
        ...selectedDrawing.variant,
        properties: {
          ...selectedDrawing.variant.properties,
          strokeWidth,
        },
      },
    })) as DrawingDto[];

    executeAction(new UpdateDrawingAction(updatedDrawings));
  };

  const onTextChange = ({ text }: DrawingFormData) => {
    if (!selectedDrawings?.length || text === undefined) return;

    const hasChanged = selectedDrawings.some(
      (selectedDrawing) =>
        selectedDrawing.variant.type === DrawingShapeType.LabelText &&
        selectedDrawing.variant.properties.text !== text,
    );
    if (!hasChanged) return;

    const updatedDrawings = selectedDrawings.map((selectedDrawing) => ({
      ...selectedDrawing,
      variant: {
        ...selectedDrawing.variant,
        properties: {
          ...selectedDrawing.variant.properties,
          text,
        },
      },
    })) as DrawingDto[];

    executeAction(new UpdateDrawingAction(updatedDrawings));
  };

  const onFillPatternChange = ({ fillPattern }: DrawingFormData) => {
    if (!selectedDrawings?.length || fillPattern === undefined) return;

    const hasChanged = selectedDrawings.some(
      (selectedDrawing) =>
        selectedDrawing.variant.type !== DrawingShapeType.Image &&
        selectedDrawing.variant.type !== DrawingShapeType.LabelText &&
        selectedDrawing.variant.properties.fillPattern !== fillPattern,
    );
    if (!hasChanged) return;

    const updatedDrawings = selectedDrawings.map((selectedDrawing) => ({
      ...selectedDrawing,
      variant: {
        ...selectedDrawing.variant,
        properties: {
          ...selectedDrawing.variant.properties,
          fillPattern,
        },
      },
    })) as DrawingDto[];

    executeAction(new UpdateDrawingAction(updatedDrawings));
  };

  const onDeleteClick = () => {
    deleteSelectedDrawings();
  };

  if (nothingSelected) {
    return null;
  }

  return singeleDrawingSelected ? (
    <SingleDrawingAttributeForm
      drawing={mapDtotoFormInput(selectedDrawings[0])}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onColorChange={onColorChange}
      onStrokeWidthChange={onStrokeWidthChange}
      onFillPatternChange={onFillPatternChange}
      onTextChange={onTextChange}
      onDeleteClick={onDeleteClick}
      isReadOnlyMode={isReadOnlyMode}
    />
  ) : (
    <MultipleDrawingAttributeForm
      drawings={selectedDrawings.map(mapDtotoFormInput)}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onColorChange={onColorChange}
      onStrokeWidthChange={onStrokeWidthChange}
      onFillPatternChange={onFillPatternChange}
      onTextChange={onTextChange}
      onDeleteClick={onDeleteClick}
      isReadOnlyMode={isReadOnlyMode}
    />
  );
}

function mapDtotoFormInput(drawing: DrawingDto): DrawingFormElement {
  if (drawing.variant.type === DrawingShapeType.Image) {
    return {
      id: drawing.id,
      addDate: drawing.addDate,
      removeDate: drawing.removeDate,
      type: DrawingShapeType.Image,
    };
  } else if (drawing.variant.type === DrawingShapeType.LabelText) {
    return {
      id: drawing.id,
      addDate: drawing.addDate,
      removeDate: drawing.removeDate,
      type: DrawingShapeType.LabelText,
      color: drawing.variant.properties.color,
      text: drawing.variant.properties.text,
    };
  } else {
    return {
      id: drawing.id,
      addDate: drawing.addDate,
      removeDate: drawing.removeDate,
      type: drawing.variant.type as DrawingShapeType,
      color: drawing.variant.properties.color,
      strokeWidth: drawing.variant.properties.strokeWidth,
      fillPattern: drawing.variant.properties.fillPattern,
    };
  }
}
