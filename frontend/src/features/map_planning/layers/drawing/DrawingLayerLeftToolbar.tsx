import useMapStore from '@/features/map_planning/store/MapStore';
import { useIsReadOnlyMode } from '../../utils/ReadOnlyModeContext';
import {
  DrawingFormData,
  MultipleDrawingAttributeForm,
  SingleDrawingAttributeForm,
} from './DrawingAttributeEditForm';
import {
  UpdateAddDateDrawingAction,
  UpdateDrawingAction,
  UpdateRemoveDateDrawingAction,
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
        executeAction(new UpdateAddDateDrawingAction([{ ...selectedDrawing, addDate }])),
    );
  };

  const onRemoveDateChange = ({ removeDate }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach(
      (selectedDrawing) =>
        removeDate != selectedDrawing.removeDate &&
        executeAction(new UpdateRemoveDateDrawingAction([{ ...selectedDrawing, removeDate }])),
    );
  };

  const onColorChange = ({ color }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach(
      (selectedDrawing) =>
        color != selectedDrawing.color &&
        executeAction(new UpdateDrawingAction([{ ...selectedDrawing, color }])),
    );
  };

  const onStrokeWidthChange = ({ strokeWidth }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach(
      (selectedDrawing) =>
        strokeWidth != selectedDrawing.strokeWidth &&
        executeAction(new UpdateDrawingAction([{ ...selectedDrawing, strokeWidth }])),
    );
  };

  const onFillEnabledChange = ({ fillEnabled }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach(
      (selectedDrawing) =>
        fillEnabled != selectedDrawing.fillEnabled &&
        executeAction(new UpdateDrawingAction([{ ...selectedDrawing, fillEnabled }])),
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
