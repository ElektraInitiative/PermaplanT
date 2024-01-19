// Plant layer util functions

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

const MINIMUM_PLANT_WIDTH = 10; // in cm

/**
 * @param the plant object which has a spread property
 * @returns the width of the plant in cm
 */
export function getPlantWidth({ spread = MINIMUM_PLANT_WIDTH }): number {
  return Math.max(spread, MINIMUM_PLANT_WIDTH);
}
