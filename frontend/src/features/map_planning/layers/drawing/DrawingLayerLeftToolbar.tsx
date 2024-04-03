import useMapStore from '@/features/map_planning/store/MapStore';
import { useIsReadOnlyMode } from '../../utils/ReadOnlyModeContext';
import {
  DrawingFormData,
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
    if (!selectedDrawings?.length) return;

    const hasChanged = selectedDrawings.some((selectedDrawing) => selectedDrawing.color !== color);
    if (!hasChanged) return;

    const updatedDrawings = selectedDrawings.map((selectedDrawing) => ({
      ...selectedDrawing,
      color,
    }));

    executeAction(new UpdateDrawingAction(updatedDrawings));
  };

  const onStrokeWidthChange = ({ strokeWidth }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    const hasChanged = selectedDrawings.some(
      (selectedDrawing) => selectedDrawing.strokeWidth !== strokeWidth,
    );
    if (!hasChanged) return;

    const updatedDrawings = selectedDrawings.map((selectedDrawing) => ({
      ...selectedDrawing,
      strokeWidth,
    }));

    executeAction(new UpdateDrawingAction(updatedDrawings));
  };

  const onFillPatternChange = ({ fillPattern }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    const hasChanged = selectedDrawings.some(
      (selectedDrawing) => selectedDrawing.fillPattern !== fillPattern,
    );
    if (!hasChanged) return;

    const updatedDrawings = selectedDrawings.map((selectedDrawing) => ({
      ...selectedDrawing,
      fillPattern,
    }));

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
      drawing={selectedDrawings[0]}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onColorChange={onColorChange}
      onStrokeWidthChange={onStrokeWidthChange}
      onFillPatternChange={onFillPatternChange}
      onDeleteClick={onDeleteClick}
      isReadOnlyMode={isReadOnlyMode}
    />
  ) : (
    <MultipleDrawingAttributeForm
      drawings={selectedDrawings}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onColorChange={onColorChange}
      onStrokeWidthChange={onStrokeWidthChange}
      onFillPatternChange={onFillPatternChange}
      onDeleteClick={onDeleteClick}
      isReadOnlyMode={isReadOnlyMode}
    />
  );
}
