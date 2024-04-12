import useMapStore from '@/features/map_planning/store/MapStore';
import { useTransformerStore } from '@/features/map_planning/store/transformer/TransformerStore';
import { DeletePlantAction } from '../actions';

export function useDeleteSelectedPlantings() {
  const selectedPlantings = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantings,
  );

  const executeAction = useMapStore((state) => state.executeAction);
  const selectPlantings = useMapStore((state) => state.selectPlantings);
  const transformerActions = useTransformerStore((state) => state.actions);

  const deleteSelectedPlantings = () => {
    if (!Array.isArray(selectedPlantings)) return;

    executeAction(new DeletePlantAction(selectedPlantings.map(({ id }) => ({ id }))));
    selectPlantings(null);
    transformerActions.clearSelection();
  };

  return {
    deleteSelectedPlantings,
  };
}
