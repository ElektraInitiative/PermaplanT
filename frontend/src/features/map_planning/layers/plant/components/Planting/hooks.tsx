import { KonvaEventObject, Node } from 'konva/lib/Node';
import { PlantingDto } from '@/api_types/definitions';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useTransformerStore } from '@/features/map_planning/store/transformer/TransformerStore';
import { isPlacementModeActive } from '@/features/map_planning/utils/planting-utils';
import { useFindPlantById } from '../../hooks/plantHookApi';
import { triggerPlantSelectionInGuidedTour, isUsingModifierKey } from './utils';

export function usePlanting(planting: PlantingDto) {
  const { data: plant } = useFindPlantById({ plantId: planting.plantId });
  const transformerActions = useTransformerStore((state) => state.actions);
  const selectPlantings = useMapStore((state) => state.selectPlantings);
  const isSelected = useIsPlantingElementSelected(planting);

  const removePlantingFromSelection = (e: KonvaEventObject<MouseEvent>) => {
    const selectedPlantings = (foundPlantings: PlantingDto[], konvaNode: Node) => {
      const plantingNode = konvaNode.getAttr('planting');
      return plantingNode ? [...foundPlantings, plantingNode] : [foundPlantings];
    };

    const getUpdatedPlantingSelection = () => {
      return transformerActions.getSelection().reduce(selectedPlantings, []) ?? [];
    };

    transformerActions.removeNodeFromSelection(e.currentTarget);
    selectPlantings(getUpdatedPlantingSelection());
  };

  const addPlantingToSelection = (e: KonvaEventObject<MouseEvent>) => {
    transformerActions.addNodeToSelection(e.currentTarget);

    const currentPlantingSelection =
      useMapStore.getState().untrackedState.layers.plants.selectedPlantings ?? [];
    selectPlantings([...currentPlantingSelection, planting]);
  };

  const handleMultiSelect = (e: KonvaEventObject<MouseEvent>) => {
    isSelected ? removePlantingFromSelection(e) : addPlantingToSelection(e);
  };

  const handleSingleSelect = (e: KonvaEventObject<MouseEvent>) => {
    transformerActions.select(e.currentTarget);
    selectPlantings([planting], useTransformerStore.getState());
  };

  const handleOnClick = (e: KonvaEventObject<MouseEvent>) => {
    if (isPlacementModeActive()) return;

    triggerPlantSelectionInGuidedTour();

    isUsingModifierKey(e) ? handleMultiSelect(e) : handleSingleSelect(e);
  };

  return {
    plant,
    isSelected,
    handleOnClick,
  };
}

function useIsPlantingElementSelected(planting: PlantingDto): boolean {
  const allSelectedPlantings = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantings,
  );

  return Boolean(
    allSelectedPlantings?.find((selectedPlanting) => selectedPlanting.id === planting.id),
  );
}
