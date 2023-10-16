import { useFindPlantById } from '../hooks/useFindPlantById';
import { PlantingDto, PlantsSummaryDto } from '@/api_types/definitions';
import { PublicNextcloudKonvaImage } from '@/features/map_planning/components/image/PublicNextcloudKonvaImage';
import useMapStore from '@/features/map_planning/store/MapStore';
import {
  setTooltipPositionToMouseCursor,
  showTooltipWithContent,
  hideTooltip,
} from '@/features/map_planning/utils/Tooltip';
import { isPlacementModeActive } from '@/features/map_planning/utils/planting-utils';
import { commonName } from '@/utils/plant-naming';
import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Circle, Rect } from 'react-konva';

export type PlantingElementProps = {
  planting: PlantingDto;
};

const placeTooltip = (plant: PlantsSummaryDto | undefined) => {
  if (!plant) return;

  setTooltipPositionToMouseCursor();

  showTooltipWithContent(commonName(plant));
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

  const addShapeToTransformer = useMapStore((state) => state.addShapeToTransformer);
  const selectPlanting = useMapStore((state) => state.selectPlanting);

  const selectedPlanting = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlanting,
  );

  const handleClickOnPlant = (e: KonvaEventObject<MouseEvent>) => {
    const triggerPlantSelectionInGuidedTour = () => {
      const placeEvent = new Event('selectPlant');
      document.getElementById('canvas')?.dispatchEvent(placeEvent);
    };

    if (!isPlacementModeActive()) {
      triggerPlantSelectionInGuidedTour();
      addShapeToTransformer(e.currentTarget);
      selectPlanting(planting);
    }
  };

  return (
    <Group
      {...planting}
      planting={planting}
      onClick={(e) => handleClickOnPlant(e)}
      onMouseOut={hideTooltip}
      onMouseMove={() => placeTooltip(plant)}
    >
      <Circle
        width={planting.width}
        height={planting.height}
        x={0}
        y={0}
        fill={selectedPlanting?.id === planting.id ? '#0084ad' : '#6f9e48'}
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
