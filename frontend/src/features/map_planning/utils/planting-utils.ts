import useMapStore from '../store/MapStore';

export function isPlacementModeActive(): boolean {
  const selectedPlantForPlanting =
    useMapStore.getState().untrackedState.layers.plants.selectedPlantForPlanting;

  return Boolean(selectedPlantForPlanting);
}
