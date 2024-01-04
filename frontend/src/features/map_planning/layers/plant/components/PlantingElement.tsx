import { KonvaEventObject, Node } from 'konva/lib/Node';
import { Group, Circle, Rect } from 'react-konva';
import { PlantingDto, PlantsSummaryDto } from '@/api_types/definitions';
import { PublicNextcloudKonvaImage } from '@/features/map_planning/components/image/PublicNextcloudKonvaImage';
import { useFindPlantById } from '@/features/map_planning/layers/plant/hooks/plantHookApi';
import useMapStore from '@/features/map_planning/store/MapStore';
import {
  setTooltipPositionToMouseCursor,
  showTooltipWithContent,
  hideTooltip,
} from '@/features/map_planning/utils/Tooltip';
import { isPlacementModeActive } from '@/features/map_planning/utils/planting-utils';
import { colors } from '@/utils/colors';
import { getNameFromPlant, getPlantNameFromAdditionalNameAndPlant } from '@/utils/plant-naming';
import { PlantLabel } from './PlantLabel';

export type PlantingElementProps = {
  planting: PlantingDto;
};

/**
 * UI Component representing a single plant on the map.
 *
 * A single plant consists of a _Konva Group_ which itself is composed of:
 * - A _Konva Circle_ filled with a selection-dependent colour
 * - A _Konva Image_ picturing the plant or showing a fallback image
 *
 * @param planting - Plant's details used for rendering the plant.
 * @returns A plant ready to be shown on the map.
 *
 */
export function PlantingElement({ planting }: PlantingElementProps) {
  const showPlantLabels = useMapStore((state) => state.untrackedState.layers.plants.showLabels);
  return (
    <>
      {planting.isArea ? (
        <AreaPlantingElement planting={planting} />
      ) : (
        <SinglePlantingElement planting={planting} />
      )}
      {showPlantLabels ? <PlantLabel planting={planting} key={planting.id} /> : null}
    </>
  );
}

/**
 * The component representing a single plant on the map.
 */
function SinglePlantingElement({ planting }: PlantingElementProps) {
  const { plant, isSelected, actions } = usePlantingElement(planting);
  const fillColor = colors.primary[400];

  return (
    <Group
      {...planting}
      planting={planting}
      draggable={true}
      onClick={actions.handleClickOnPlant}
      onMouseOut={hideTooltip}
      onMouseMove={() => placeTooltip(plant, planting.additionalName)}
    >
      <Circle
        width={planting.width}
        height={planting.height}
        x={0}
        y={0}
        fill={isSelected ? colors.secondary[200] : fillColor}
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
      ) : null}
    </Group>
  );
}

/**
 * The component representing an area of plants on the map.
 */
function AreaPlantingElement({ planting }: PlantingElementProps) {
  const { plant, isSelected, actions } = usePlantingElement(planting);
  const fillColor = isSelected ? colors.secondary[200] : colors.purple[400];

  return (
    <Group
      {...planting}
      planting={planting}
      draggable={true}
      onClick={actions.handleClickOnPlant}
      onMouseOut={hideTooltip}
      onMouseMove={() => placeTooltip(plant, planting.additionalName)}
    >
      <Rect width={planting.width} height={planting.height} fill={fillColor} />
      {plant ? <AreaPlantingImage planting={planting} plant={plant} /> : null}
    </Group>
  );
}

function AreaPlantingImage({
  planting,
  plant,
}: PlantingElementProps & { plant: PlantsSummaryDto }) {
  const size = Math.min(planting.width, planting.height) * 0.9;

  return (
    <PublicNextcloudKonvaImage
      shareToken="2arzyJZYj2oNnHX"
      path={`Icons/${plant?.unique_name}.png`}
      width={size}
      height={size}
      offset={{
        x: -planting.width / 2 + size / 2,
        y: 0,
      }}
      showErrorMessage={false}
    />
  );
}

function usePlantingElement(planting: PlantingDto) {
  const { data: plant } = useFindPlantById({ plantId: planting.plantId });
  const setSingleNodeInTransformer = useMapStore((state) => state.setSingleNodeInTransformer);
  const addNodeToTransformer = useMapStore((state) => state.addNodeToTransformer);
  const removeNodeFromTransformer = useMapStore((state) => state.removeNodeFromTransformer);
  const selectPlantings = useMapStore((state) => state.selectPlantings);
  const isSelected = useIsPlantingElementSelected(planting);

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

  const handleMultiSelect = (e: KonvaEventObject<MouseEvent>) => {
    isSelected ? removePlantingFromSelection(e) : addPlantingToSelection(e);
  };

  const handleSingleSelect = (e: KonvaEventObject<MouseEvent>) => {
    setSingleNodeInTransformer(e.currentTarget);
    selectPlantings([planting]);
  };

  const handleClickOnPlant = (e: KonvaEventObject<MouseEvent>) => {
    if (isPlacementModeActive()) return;

    triggerPlantSelectionInGuidedTour();

    isUsingModifierKey(e) ? handleMultiSelect(e) : handleSingleSelect(e);
  };

  return {
    plant,
    isSelected,
    actions: {
      handleClickOnPlant,
    },
  };
}

function useIsPlantingElementSelected(planting: PlantingDto): boolean {
  const allSelectedPlantings = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantings,
  );

  return Boolean(
    allSelectedPlantings?.find((selectedPlanting) => selectedPlanting.id === planting.id),
  );
}

function triggerPlantSelectionInGuidedTour(): void {
  const placeEvent = new Event('selectPlant');
  document.getElementById('canvas')?.dispatchEvent(placeEvent);
}

function isUsingModifierKey(e: KonvaEventObject<MouseEvent>): boolean {
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
