import { PlantingDto } from '@/api_types/definitions';
import useMapStore from '../store/MapStore';

/**
 * Placement mode is active if the map store's selectedPlantForPlanting field currently stores a plant.
 * This happens for instance, if a user selects a plant from the plants search list.
 *
 * The placement mode ends, i.e. it becomes inactive, when the user explicitly stops it and,
 * as a consequence, the map store's selectedPlantForPlanting field is set to null.
 *
 * @returns true if map store contains a plant selected for planting, false otherwise
 */
export function isPlacementModeActive(): boolean {
  const selectedPlantForPlanting =
    useMapStore.getState().untrackedState.layers.plants.selectedPlantForPlanting;

  return Boolean(selectedPlantForPlanting);
}

export function isOneAreaOfPlanting(dtos: PlantingDto[] | null): boolean {
  return dtos?.length === 1 && dtos[0].isArea;
}
