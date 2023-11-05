import useMapStore from '../store/MapStore';
import { UNTRACKED_DEFAULT_STATE, UntrackedMapSlice } from '../store/MapStoreTypes';
import { isPlacementModeActive } from './planting-utils';
import { PlantsSummaryDto } from '@/api_types/definitions';

describe('isPlacementModeActive', () => {
  test('should return true if map store currently contains a plant selected for planting', () => {
    useMapStore.setState(createStoreWithGivenPlantSelected(createSomePlant()));

    expect(isPlacementModeActive()).toBe(true);
  });

  test('should return false if map store currently contains nothing selected for planting', () => {
    useMapStore.setState(createStoreWithGivenPlantSelected(null));

    expect(isPlacementModeActive()).toBe(false);
  });
});

function createStoreWithGivenPlantSelected(
  plant: PlantsSummaryDto | null,
): Pick<UntrackedMapSlice, 'untrackedState'> {
  return {
    untrackedState: {
      ...UNTRACKED_DEFAULT_STATE,
      layers: {
        ...UNTRACKED_DEFAULT_STATE.layers,
        plants: {
          ...UNTRACKED_DEFAULT_STATE.layers.plants,
          selectedPlantForPlanting: plant ? { plant, seed: null } : null,
        },
      },
    },
  };
}

function createSomePlant(): PlantsSummaryDto {
  return {
    id: expect.any(Number),
    unique_name: expect.any(String),
  };
}
