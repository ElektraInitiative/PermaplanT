import { useFindPlantById } from '../hooks/useFindPlantById';
import { PlantingDto, PlantsSummaryDto, SeedDto } from '@/api_types/definitions';
import { PublicNextcloudKonvaImage } from '@/features/map_planning/components/image/PublicNextcloudKonvaImage';
import { useFindSeedById } from '@/features/map_planning/layers/plant/hooks/useFindSeedById';
import useMapStore from '@/features/map_planning/store/MapStore';
import {
  setTooltipPositionToMouseCursor,
  showTooltipWithContent,
  hideTooltip,
} from '@/features/map_planning/utils/Tooltip';
import { isPlacementModeActive } from '@/features/map_planning/utils/planting-utils';
import { COLOR_PRIMARY_400, COLOR_SECONDARY_400 } from '@/utils/constants';
import { getNameFromPlant, getPlantNameFromSeedAndPlant } from '@/utils/plant-naming';
import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Circle, Rect } from 'react-konva';

export type PlantingElementProps = {
  planting: PlantingDto;
};

const placeTooltip = (plant: PlantsSummaryDto | undefined, seed: SeedDto | undefined) => {
  if (!plant) return;

  setTooltipPositionToMouseCursor();
  if (!seed) {
    showTooltipWithContent(getNameFromPlant(plant));
  } else {
    showTooltipWithContent(getPlantNameFromSeedAndPlant(seed, plant));
  }
};

const isPlantingElementSelected = (
  planting: PlantingDto,
  allSelectedPlantings: PlantingDto[] | null,
) => {
  return Boolean(
    allSelectedPlantings?.find((selectedPlanting) => selectedPlanting.id === planting.id),
  );
};

/**
 * UI Component representing a single plant on the map.
 *
 * A single plant consists of a _Konva Group_ which itself is composed of:
 * - A _Konva Circle_ filled with a selection-dependent colour
 * - A _Konva Image_ depicturing the plant or showing a fallback image
 *
 * @param planting - Plant's details used for rendering the plant.
 * @returns A plant ready to be shown on the map.
 *
 */
export function PlantingElement({ planting }: PlantingElementProps) {
  const { plant } = useFindPlantById(planting.plantId);
  const { seed } = useFindSeedById(planting.seedId ?? -1, true, true);

  const addShapeToTransformer = useMapStore((state) => state.addShapeToTransformer);
  const selectPlantings = useMapStore((state) => state.selectPlantings);

  const allSelectedPlantings = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantings,
  );
  const isSelected = isPlantingElementSelected(planting, allSelectedPlantings);

  const handleClickOnPlant = (e: KonvaEventObject<MouseEvent>) => {
    const triggerPlantSelectionInGuidedTour = () => {
      const placeEvent = new Event('selectPlant');
      document.getElementById('canvas')?.dispatchEvent(placeEvent);
    };

    if (!isPlacementModeActive()) {
      triggerPlantSelectionInGuidedTour();
      addShapeToTransformer(e.currentTarget);
      selectPlantings([planting]);
    }
  };

  return (
    <Group
      {...planting}
      planting={planting}
      onClick={(e) => handleClickOnPlant(e)}
      onMouseOut={hideTooltip}
      onMouseMove={() => placeTooltip(plant, seed)}
    >
      <Circle
        width={planting.width}
        height={planting.height}
        x={0}
        y={0}
        fill={isSelected ? COLOR_SECONDARY_400 : COLOR_PRIMARY_400}
      />
      {plant ? (
        <PublicNextcloudKonvaImage
          shareToken="2arzyJZYj2oNnHX"
          path={`Icons/${plant?.unique_name}.png`}
          width={planting.width * 0.9}
          height={planting.height * 0.9}
          offset={{ x: (planting.width * 0.9) / 2, y: (planting.height * 0.9) / 2 }}
          showErrorMessage={false}
        />
      ) : (
        <Rect width={0} height={0} />
      )}
    </Group>
  );
}
