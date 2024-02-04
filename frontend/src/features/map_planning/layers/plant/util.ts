// Plant layer util functions
import { PlantSpread } from '@/api_types/definitions';

export function calculatePlantCount(
  plantSize: number,
  fieldWidth: number,
  fieldHeight: number,
): { perRow: number; perColumn: number; total: number } {
  const perRow = Math.floor(fieldWidth / plantSize);
  const perColumn = Math.floor(fieldHeight / plantSize);

  return {
    perRow: perRow,
    perColumn: perColumn,
    total: perRow * perColumn,
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
