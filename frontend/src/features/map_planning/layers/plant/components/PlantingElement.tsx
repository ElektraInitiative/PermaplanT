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
import { COLOR_PRIMARY_400, COLOR_SECONDARY_400 } from '@/utils/constants';
import { getNameFromPlant, getPlantNameFromAdditionalNameAndPlant } from '@/utils/plant-naming';
import { KonvaEventObject, Node } from 'konva/lib/Node';
import { Group, Circle, Rect } from 'react-konva';

export type PlantingElementProps = {
  planting: PlantingDto;
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

  const setSingleNodeInTransformer = useMapStore((state) => state.setSingleNodeInTransformer);
  const addNodeToTransformer = useMapStore((state) => state.addNodeToTransformer);
  const removeNodeFromTransformer = useMapStore((state) => state.removeNodeFromTransformer);

  const selectPlantings = useMapStore((state) => state.selectPlantings);
  const isSelected = isPlantingElementSelected(planting);
  console.log('selection: ', planting.plantId, isSelected);

  const removePlantingFromSelection = (e: KonvaEventObject<MouseEvent>) => {
    const selectedPlantings = (foundPlantings: PlantingDto[], konvaNode: Node) => {
      const plantingNode = konvaNode.getAttr('planting');
      return plantingNode ? [...foundPlantings, plantingNode] : [foundPlantings];
    };

    const getUpdatedPlantingSelection = () => {
      const transformer = useMapStore.getState().transformer.current;
      return transformer?.nodes().reduce(selectedPlantings, []) ?? [];
    };

    removeNodeFromTransformer(e.currentTarget);
    selectPlantings(getUpdatedPlantingSelection());
  };

  const addPlantingToSelection = (e: KonvaEventObject<MouseEvent>) => {
    addNodeToTransformer(e.currentTarget);

    const currentPlantingSelection =
      useMapStore.getState().untrackedState.layers.plants.selectedPlantings ?? [];
    selectPlantings([...currentPlantingSelection, planting]);
  };

  const handleMultiSelect = (e: KonvaEventObject<MouseEvent>, planting: PlantingDto) => {
    isPlantingElementSelected(planting)
      ? removePlantingFromSelection(e)
      : addPlantingToSelection(e);
  };

  const handleSingleSelect = (e: KonvaEventObject<MouseEvent>, planting: PlantingDto) => {
    setSingleNodeInTransformer(e.currentTarget);
    selectPlantings([planting]);
  };

  const handleClickOnPlant = (e: KonvaEventObject<MouseEvent>) => {
    if (isPlacementModeActive()) return;

    triggerPlantSelectionInGuidedTour();

    isUsingModiferKey(e) ? handleMultiSelect(e, planting) : handleSingleSelect(e, planting);
  };

  return (
    <Group
      {...planting}
      planting={planting}
      draggable={true}
      onClick={(e) => handleClickOnPlant(e)}
      onMouseOut={hideTooltip}
      onMouseMove={() => placeTooltip(plant, planting.additionalName)}
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

function isPlantingElementSelected(planting: PlantingDto): boolean {
  const allSelectedPlantings =
    useMapStore.getState().untrackedState.layers.plants.selectedPlantings;

  return Boolean(
    allSelectedPlantings?.find((selectedPlanting) => selectedPlanting.id === planting.id),
  );
}

function triggerPlantSelectionInGuidedTour(): void {
  const placeEvent = new Event('selectPlant');
  document.getElementById('canvas')?.dispatchEvent(placeEvent);
}

function isUsingModiferKey(e: KonvaEventObject<MouseEvent>): boolean {
  return e.evt.ctrlKey || e.evt.shiftKey || e.evt.metaKey;
}

function placeTooltip(plant: PlantsSummaryDto | undefined, additionalName: string | undefined) {
  if (!plant) return;

  setTooltipPositionToMouseCursor();
  if (!additionalName) {
    showTooltipWithContent(getNameFromPlant(plant));
  } else {
    showTooltipWithContent(getPlantNameFromAdditionalNameAndPlant(additionalName, plant));
  }
}
