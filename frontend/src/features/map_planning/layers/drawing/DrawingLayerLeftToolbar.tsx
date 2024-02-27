import useMapStore from '@/features/map_planning/store/MapStore';
import { useIsReadOnlyMode } from '../../utils/ReadOnlyModeContext';
import {
  DrawingFormData,
  MultipleDrawingAttributeForm,
  SingleDrawingAttributeForm,
} from './DrawingAttributeEditForm';
import {
  UpdateAddDateDrawingAction,
  UpdateColorDrawingAction,
  UpdateEnableFillDrawingAction,
  UpdateRemoveDateDrawingAction,
  UpdateStrokeWidthDrawingAction,
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

    selectedDrawings.forEach(
      (selectedDrawing) =>
        addDate != selectedDrawing.addDate &&
        executeAction(new UpdateAddDateDrawingAction({ id: selectedDrawing.id, addDate })),
    );
  };

  const onRemoveDateChange = ({ removeDate }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach(
      (selectedDrawing) =>
        removeDate != selectedDrawing.removeDate &&
        executeAction(new UpdateRemoveDateDrawingAction({ id: selectedDrawing.id, removeDate })),
    );
  };

  const onColorChange = ({ color }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach(
      (selectedDrawing) =>
        color != selectedDrawing.color &&
        executeAction(new UpdateColorDrawingAction({ id: selectedDrawing.id, color })),
    );
  };

  const onStrokeWidthChange = ({ strokeWidth }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach(
      (selectedDrawing) =>
        strokeWidth != selectedDrawing.strokeWidth &&
        executeAction(new UpdateStrokeWidthDrawingAction({ id: selectedDrawing.id, strokeWidth })),
    );
  };

  const onFillEnabledChange = ({ fillEnabled }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach(
      (selectedDrawing) =>
        fillEnabled != selectedDrawing.fillEnabled &&
        executeAction(new UpdateEnableFillDrawingAction({ id: selectedDrawing.id, fillEnabled })),
    );
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
      onFillEnabledChange={onFillEnabledChange}
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
      onFillEnabledChange={onFillEnabledChange}
      onDeleteClick={onDeleteClick}
      isReadOnlyMode={isReadOnlyMode}
    />
  );
}
