import { PlantsSummaryDto } from '@/bindings/definitions';
import { ExtendedPlantsSummary } from '@/utils/extendedPlantsSummary';
import { useMemo } from 'react';

export function useExtendedPlantSummaryTransformed(plant: PlantsSummaryDto) {
  const extendedPlantSummaryTransformed = useMemo(() => {
    return new ExtendedPlantsSummary(plant);
  }, [plant]);
  return extendedPlantSummaryTransformed;
}
