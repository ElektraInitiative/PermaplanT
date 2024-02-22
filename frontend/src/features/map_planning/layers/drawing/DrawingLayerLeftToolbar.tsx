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

    selectedDrawings.forEach((selectedDrawing) =>
      executeAction(new UpdateAddDateDrawingAction({ id: selectedDrawing.id, addDate })),
    );
  };

  const onRemoveDateChange = ({ removeDate }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach((selectedDrawing) =>
      executeAction(new UpdateRemoveDateDrawingAction({ id: selectedDrawing.id, removeDate })),
    );
  };

  const onColorChange = ({ color }: DrawingFormData) => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach((selectedDrawing) =>
      executeAction(new UpdateColorDrawingAction({ id: selectedDrawing.id, color })),
    );
  };

  const onStrokeWidthChange = ({ strokeWidth }: DrawingFormData) => {
    console.log('onStrokeWidthChange', strokeWidth);
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach((selectedDrawing) =>
      executeAction(new UpdateStrokeWidthDrawingAction({ id: selectedDrawing.id, strokeWidth })),
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
      onDeleteClick={onDeleteClick}
      isReadOnlyMode={isReadOnlyMode}
    />
  );
}
