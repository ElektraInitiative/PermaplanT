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
    if (!Array.isArray(selectedPlantings)) return;

    executeAction(new DeletePlantAction(selectedPlantings.map(({ id }) => ({ id }))));
    selectPlantings(null);
    transformerRef.current?.nodes([]);
  };

  return {
    deleteSelectedPlantings,
  };
}
