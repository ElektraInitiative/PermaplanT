import { renderHook, waitFor } from '@testing-library/react';
import { expect } from 'vitest';
import { allPlantsForTesting } from '@/__test_utils__/msw_handlers/plants';
import '@/__test_utils__/setup';
import '@/__test_utils__/setupSessionStorageAuth';
import { useSelectPlantForPlanting } from '@/features/map_planning/layers/plant/hooks/useSelectPlantForPlanting';
import { useSelectedPlantForPlanting } from '@/features/map_planning/layers/plant/hooks/useSelectedPlantForPlanting';

describe('useSelectPlantForPlanting', () => {
  const renderUseSelectPlantForPlanting = () => renderHook(() => useSelectPlantForPlanting());

  it('should set the given plant as plant for planting', async () => {
    const { result } = renderUseSelectPlantForPlanting();
    const plantForPlanting = allPlantsForTesting[0];

    await waitFor(() =>
      expect(
        result.current.actions.selectPlantForPlanting({ plant: plantForPlanting, seed: null }),
      ).toBeUndefined(),
    );
    const selectedPlant = renderHook(() => useSelectedPlantForPlanting());
    expect(selectedPlant.result.current).toBeDefined();
    expect(selectedPlant.result.current?.plant).toBe(plantForPlanting);
    expect(selectedPlant.result.current?.seed).toBeNull();
  });
});
