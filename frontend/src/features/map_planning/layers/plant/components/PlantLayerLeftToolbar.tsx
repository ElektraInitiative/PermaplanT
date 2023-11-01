import { useIsReadOnlyMode } from '../../../utils/ReadOnlyModeContext';
import {
  DeletePlantAction,
  UpdateAddDatePlantAction,
  UpdateRemoveDatePlantAction,
} from '../actions';
import {
  PlantingDateAttribute,
  SinglePlantingAttributeForm,
  MultiplePlantingsAttributeForm,
} from './PlantingAttributeEditForm';
import useMapStore from '@/features/map_planning/store/MapStore';

export function PlantLayerLeftToolbar() {
  const selectedPlantings = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantings,
  );
  const executeAction = useMapStore((state) => state.executeAction);
  const selectPlantings = useMapStore((state) => state.selectPlantings);
  const transformerRef = useMapStore((state) => state.transformer);
  const step = useMapStore((state) => state.step);

  const isReadOnlyMode = useIsReadOnlyMode();

  const nothingSelected = !selectedPlantings?.length;
  const singlePlantSelected = selectedPlantings?.length === 1;

  const onAddDateChange = ({ addDate }: PlantingDateAttribute) => {
    if (!selectedPlantings?.length) return;

    selectedPlantings.forEach((selectedPlanting) =>
      executeAction(new UpdateAddDatePlantAction({ id: selectedPlanting.id, addDate })),
    );
  };

  const onRemoveDateChange = ({ removeDate }: PlantingDateAttribute) => {
    if (!selectedPlantings?.length) return;

    selectedPlantings.forEach((selectedPlanting) =>
      executeAction(new UpdateRemoveDatePlantAction({ id: selectedPlanting.id, removeDate })),
    );
  };

  const onDeleteClick = () => {
    if (!selectedPlantings?.length) return;

    selectedPlantings.forEach((selectedPlanting) =>
      executeAction(new DeletePlantAction({ id: selectedPlanting.id })),
    );

    selectPlantings(null);
    transformerRef.current?.nodes([]);
  };

  if (nothingSelected) {
    return null;
  }

  return singlePlantSelected ? (
    <SinglePlantingAttributeForm
      planting={selectedPlantings[0]}
      // remount the form when the selected planting or the step changes (on undo/redo)
      key={`${selectedPlantings[0].id}-${step}`}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onDeleteClick={onDeleteClick}
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
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
      onDeleteClick={onDeleteClick}
      isReadOnlyMode={isReadOnlyMode}
    />
  );
}
