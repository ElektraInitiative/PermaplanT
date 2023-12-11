import { useIsReadOnlyMode } from '../../utils/ReadOnlyModeContext';
import {
  DrawingColorAttribute,
  DrawingDateAttribute,
  MultipleDrawingAttributeForm,
  SingleDrawingAttributeForm,
} from './DrawingAttributeEditForm';
import {
  UpdateAddDateDrawingAction,
  UpdateColorDrawingAction,
  UpdateRemoveDateDrawingAction,
} from './actions';
import { useDeleteSelectedDrawings } from './hooks/useDeleteSelectedDrawings';
import useMapStore from '@/features/map_planning/store/MapStore';

export function DrawingLayerLeftToolbar() {
  const selectedDrawings = useMapStore(
    (state) => state.untrackedState.layers.drawing.selectedDrawings,
  );

  const executeAction = useMapStore((state) => state.executeAction);
  const step = useMapStore((state) => state.step);
  const { deleteSelectedDrawings } = useDeleteSelectedDrawings();

  const isReadOnlyMode = useIsReadOnlyMode();

  const nothingSelected = !selectedDrawings?.length;
  const singeleDrawingSelected = selectedDrawings?.length === 1;

  const onAddDateChange = ({ addDate }: DrawingDateAttribute) => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach((selectedDrawing) =>
      executeAction(new UpdateAddDateDrawingAction({ id: selectedDrawing.id, addDate })),
    );
  };

  const onRemoveDateChange = ({ removeDate }: DrawingDateAttribute) => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach((selectedDrawing) =>
      executeAction(new UpdateRemoveDateDrawingAction({ id: selectedDrawing.id, removeDate })),
    );
  };

  const onColorChange = ({ color }: DrawingColorAttribute) => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach((selectedDrawing) =>
      executeAction(new UpdateColorDrawingAction({ id: selectedDrawing.id, color })),
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
      key={`${selectedDrawings[0].id}-${step}`}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onColorChange={onColorChange}
      onDeleteClick={onDeleteClick}
      isReadOnlyMode={isReadOnlyMode}
    />
  ) : (
    <MultipleDrawingAttributeForm
      drawings={selectedDrawings}
      key={
        selectedDrawings.reduce((key, selectedDrawingg) => (key += selectedDrawingg.id + '-'), '') +
        `${step}`
      }
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onColorChange={onColorChange}
      onDeleteClick={onDeleteClick}
      isReadOnlyMode={isReadOnlyMode}
    />
  );
}
