import { KonvaEventObject } from 'konva/lib/Node';
import { PlantsSummaryDto } from '@/api_types/definitions';
import {
  setTooltipPositionToMouseCursor,
  showTooltipWithContent,
} from '@/features/map_planning/utils/Tooltip';
import { getNameFromPlant, getPlantNameFromAdditionalNameAndPlant } from '@/utils/plant-naming';

export function triggerPlantSelectionInGuidedTour(): void {
  const placeEvent = new Event('selectPlant');
  document.getElementById('canvas')?.dispatchEvent(placeEvent);
}

export function isUsingModifierKey(e: KonvaEventObject<MouseEvent>): boolean {
  return e.evt.ctrlKey || e.evt.shiftKey || e.evt.metaKey;
}

export function placeTooltip(
  plant: PlantsSummaryDto | undefined,
  additionalName: string | undefined,
) {
  if (!plant) return;

  setTooltipPositionToMouseCursor();
  if (!additionalName) {
    showTooltipWithContent(getNameFromPlant(plant));
  } else {
    showTooltipWithContent(getPlantNameFromAdditionalNameAndPlant(additionalName, plant));
  }
}
