import {
  DeletePlantAction,
  UpdateAddDatePlantAction,
  UpdateRemoveDatePlantAction,
} from '../actions';
import { useFindPlantById } from '../hooks/useFindPlantById';
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

  const { plant } = useFindPlantById(selectedPlanting?.plantId ?? NaN, Boolean(selectedPlanting));

  const onDeleteClick = () => {
    if (!selectedPlanting) return;
    executeAction(new DeletePlantAction(selectedPlanting?.id));
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
      key={selectedPlanting.id}
      plant={plant}
      planting={selectedPlanting}
      onDeleteClick={onDeleteClick}
      onAddDateChange={onAddDateChange}
      onRemoveDateChange={onRemoveDateChange}
    />
  ) : null;
}
