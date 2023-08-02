import useMapStore from '@/features/map_planning/store/MapStore';

export function useSelectedPlantForPlanting() {
  const selectedPlantForPlanting = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantForPlanting,
  );

  return selectedPlantForPlanting;
}
