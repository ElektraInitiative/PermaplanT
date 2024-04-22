import useMapStore from '@/features/map_planning/store/MapStore';
import { useIsReadOnlyMode } from '../../../utils/ReadOnlyModeContext';
import {
  TransformPlantAction,
  UpdateAddDatePlantAction,
  UpdatePlantingNotesAction,
  UpdateRemoveDatePlantAction,
} from '../actions';
import { useDeleteSelectedPlantings } from '../hooks/useDeleteSelectedPlantings';
import {
  PlantingFormData,
  SinglePlantingAttributeForm,
  MultiplePlantingsAttributeForm,
} from './PlantingAttributeEditForm';

export function PlantLayerLeftToolbar() {
  const selectedPlantings = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantings,
  );
  const executeAction = useMapStore((state) => state.executeAction);
  const { deleteSelectedPlantings } = useDeleteSelectedPlantings();

  const isReadOnlyMode = useIsReadOnlyMode();

  const nothingSelected = !selectedPlantings?.length;
  const singlePlantSelected = selectedPlantings?.length === 1;

  const onAddDateChange = ({ addDate }: PlantingFormData) => {
    if (!selectedPlantings?.length) return;

    const hasChanged = selectedPlantings.some(
      (selectedPlanting) => selectedPlanting.addDate !== addDate,
    );
    if (!hasChanged) return;

    executeAction(
      new UpdateAddDatePlantAction(selectedPlantings.map((p) => ({ id: p.id, addDate }))),
    );
  };

  const onRemoveDateChange = ({ removeDate }: PlantingFormData) => {
    if (!selectedPlantings?.length) return;

    const hasChanged = selectedPlantings.some(
      (selectedPlanting) => selectedPlanting.removeDate !== removeDate,
    );
    if (!hasChanged) return;

    executeAction(
      new UpdateRemoveDatePlantAction(selectedPlantings.map((p) => ({ id: p.id, removeDate }))),
    );
  };

  const onPlantingNoteChange = ({ plantingNotes }: PlantingFormData) => {
    if (!selectedPlantings?.length) return;

    const hasChanged = selectedPlantings.some(
      (selectedPlanting) => selectedPlanting.plantingNotes !== plantingNotes,
    );
    if (!hasChanged) return;

    executeAction(
      new UpdatePlantingNotesAction(
        selectedPlantings.map((p) => ({ id: p.id, notes: plantingNotes || '' })),
      ),
    );
  };

  const onSizeChange = ({ sizeX, sizeY }: PlantingFormData) => {
    if (!selectedPlantings?.length) return;

    const hasChanged = selectedPlantings.some(
      (selectedPlanting) =>
        selectedPlanting.sizeX !== Math.round(sizeX) ||
        selectedPlanting.sizeY !== Math.round(sizeY),
    );
    if (!hasChanged) return;

    const updates = selectedPlantings.map((selectedPlanting) => ({
      id: selectedPlanting.id,
      x: selectedPlanting.x,
      y: selectedPlanting.y,
      sizeX: isNaN(sizeX) ? selectedPlanting.sizeX : Math.round(sizeX),
      sizeY: isNaN(sizeY) ? selectedPlanting.sizeY : Math.round(sizeY),
      rotation: selectedPlanting.rotation,
    }));

    executeAction(new TransformPlantAction(updates));
  };

  const onDeleteClick = () => {
    deleteSelectedPlantings();
  };

  if (nothingSelected) {
    return null;
  }

  return singlePlantSelected ? (
    <SinglePlantingAttributeForm
      planting={selectedPlantings[0]}
      onHeightChange={onSizeChange}
      onWidthChange={onSizeChange}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onDeleteClick={onDeleteClick}
      onPlantingNotesChange={onPlantingNoteChange}
      isReadOnlyMode={isReadOnlyMode}
    />
  ) : (
    <MultiplePlantingsAttributeForm
      plantings={selectedPlantings}
      onHeightChange={onSizeChange}
      onWidthChange={onSizeChange}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onDeleteClick={onDeleteClick}
      onPlantingNotesChange={onPlantingNoteChange}
      isReadOnlyMode={isReadOnlyMode}
    />
  );
}
