import { useState } from 'react';
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
  const step = useMapStore((state) => state.step);
  const { deleteSelectedPlantings } = useDeleteSelectedPlantings();

  const isReadOnlyMode = useIsReadOnlyMode();

  const nothingSelected = !selectedPlantings?.length;
  const singlePlantSelected = selectedPlantings?.length === 1;

  const onAddDateChange = ({ addDate }: PlantingFormData) => {
    if (!selectedPlantings?.length) return;

    executeAction(
      new UpdateAddDatePlantAction(selectedPlantings.map((p) => ({ id: p.id, addDate }))),
    );
  };

  const onRemoveDateChange = ({ removeDate }: PlantingFormData) => {
    if (!selectedPlantings?.length) return;

    executeAction(
      new UpdateRemoveDatePlantAction(selectedPlantings.map((p) => ({ id: p.id, removeDate }))),
    );
  };

  const onPlantingNoteChange = ({ plantingNotes }: PlantingFormData) => {
    if (!selectedPlantings?.length) return;

    executeAction(
      new UpdatePlantingNotesAction(
        selectedPlantings.map((p) => ({ id: p.id, notes: plantingNotes || '' })),
      ),
    );
  };

  // since the toolbar is currently rerendered when the selected plantings change, we need to keep the state of the fullscreen mode
  const [plantingNotesFullScreen, setPlantingNotesFullscreen] = useState(false);

  const onSizeChange = ({ sizeX, sizeY }: PlantingFormData) => {
    if (!selectedPlantings?.length) return;

    const updates = selectedPlantings.map((selectedPlanting) => ({
      id: selectedPlanting.id,
      x: selectedPlanting.x,
      y: selectedPlanting.y,
      sizeX: Math.round(sizeX),
      sizeY: Math.round(sizeY),
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
      // remount the form when the selected planting or the step changes (on undo/redo)
      key={`${selectedPlantings[0].id}-${step}`}
      onHeightChange={onSizeChange}
      onWidthChange={onSizeChange}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onDeleteClick={onDeleteClick}
      onPlantingNotesChange={onPlantingNoteChange}
      plantingNotesFullScreen={plantingNotesFullScreen}
      changePlantingNotesFullScreen={setPlantingNotesFullscreen}
      isReadOnlyMode={isReadOnlyMode}
    />
  ) : (
    <MultiplePlantingsAttributeForm
      plantings={selectedPlantings}
      key={
        selectedPlantings.reduce(
          (key, selectedPlanting) => (key += selectedPlanting.id + '-'),
          '',
        ) + `${step}`
      }
      onHeightChange={onSizeChange}
      onWidthChange={onSizeChange}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onDeleteClick={onDeleteClick}
      onPlantingNotesChange={onPlantingNoteChange}
      plantingNotesFullScreen={plantingNotesFullScreen}
      changePlantingNotesFullScreen={setPlantingNotesFullscreen}
      isReadOnlyMode={isReadOnlyMode}
    />
  );
}
