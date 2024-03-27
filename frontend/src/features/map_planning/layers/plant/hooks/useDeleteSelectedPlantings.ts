import useMapStore from '@/features/map_planning/store/MapStore';
import { DeletePlantAction } from '../actions';

export function useDeleteSelectedPlantings() {
  const selectedPlantings = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantings,
  );

  const executeAction = useMapStore((state) => state.executeAction);
  const selectPlantings = useMapStore((state) => state.selectPlantings);
  const transformerRef = useMapStore((state) => state.transformer);

  const deleteSelectedPlantings = () => {
    if (!selectedPlantings?.length) return;

    selectedPlantings.forEach((selectedPlanting) =>
      executeAction(new DeletePlantAction({ id: selectedPlanting.id })),
    );

    selectPlantings(null);
    transformerRef.current?.nodes([]);
  };

  return {
    deleteSelectedPlantings,
  };
}
