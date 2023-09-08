import useMapStore from '../store/MapStore';
import { UNTRACKED_DEFAULT_STATE, UntrackedMapSlice } from '../store/MapStoreTypes';
import { isPlacementModeActive } from './planting-utils';
import { PlantsSummaryDto } from '@/bindings/definitions';

describe('isPlacementModeActive', () => {
  test('should return true if plant from search list is currently selected', () => {
    useMapStore.setState(createStoreWithGivenPlantSelected(createSomePlant()));

    expect(isPlacementModeActive()).toBe(true);
  });

  test('should return false if no plant is selected from search list', () => {
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
          selectedPlantForPlanting: plant,
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
