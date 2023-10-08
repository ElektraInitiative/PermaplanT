import { useIsReadOnlyMode } from '../../../utils/ReadOnlyModeContext';
import {
  DeletePlantAction,
  UpdateAddDatePlantAction,
  UpdateRemoveDatePlantAction,
} from '../actions';
import { usePlant } from '../hooks/usePlant';
import {
  PlantingAttributeEditForm,
  PlantingAttributeEditFormData,
} from './PlantingAttributeEditForm';
import useMapStore from '@/features/map_planning/store/MapStore';

export function PlantLayerLeftToolbar() {
  const selectedPlanting = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlanting,
  );
  const executeAction = useMapStore((state) => state.executeAction);
  const selectPlanting = useMapStore((state) => state.selectPlanting);
  const transformerRef = useMapStore((state) => state.transformer);
  const step = useMapStore((state) => state.step);

  const isReadOnlyMode = useIsReadOnlyMode();

  const { plant } = usePlant(selectedPlanting?.plantId ?? NaN, Boolean(selectedPlanting));

  const onDeleteClick = () => {
    if (!selectedPlanting) return;
    executeAction(new DeletePlantAction({ id: selectedPlanting?.id }));
    selectPlanting(null);
    transformerRef.current?.nodes([]);
  };

  const onAddDateChange = ({ addDate }: PlantingAttributeEditFormData) => {
    if (!selectedPlanting) return;
    executeAction(new UpdateAddDatePlantAction({ id: selectedPlanting.id, addDate }));
  };

  const onRemoveDateChange = ({ removeDate }: PlantingAttributeEditFormData) => {
    if (!selectedPlanting) return;
    executeAction(new UpdateRemoveDatePlantAction({ id: selectedPlanting.id, removeDate }));
  };

  return selectedPlanting && plant ? (
    <PlantingAttributeEditForm
      disabled={isReadOnlyMode}
      // remount the form when the selected planting or the step changes (on undo/redo)
      key={`${selectedPlanting.id}-${step}`}
      plant={plant}
      planting={selectedPlanting}
      onDeleteClick={onDeleteClick}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
    />
  ) : null;
}
