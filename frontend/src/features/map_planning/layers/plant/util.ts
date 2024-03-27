// Plant layer util functions
import { PlantSpread } from '@/api_types/definitions';

export function calculatePlantCount(
  plantSize: number,
  fieldWidth: number,
  fieldHeight: number,
): { horizontalPlantCount: number; verticalPlantCount: number } {
  const horizontalPlantCount = Math.floor(fieldWidth / plantSize);
  const verticalPlantCount = Math.floor(fieldHeight / plantSize);

  return {
    horizontalPlantCount,
    verticalPlantCount,
  };
}

const PLANT_WIDTHS = new Map<PlantSpread, number>([
  [PlantSpread.Narrow, 10],
  [PlantSpread.Medium, 50],
  [PlantSpread.Wide, 100],
]);

export function getPlantWidth({ spread = PlantSpread.Medium }): number {
  return PLANT_WIDTHS.get(spread) ?? (PLANT_WIDTHS.get(PlantSpread.Medium) as number);
}
