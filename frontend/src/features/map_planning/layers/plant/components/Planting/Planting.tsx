import { Group, Circle, Rect } from 'react-konva';
import { PlantingDto, PlantsSummaryDto } from '@/api_types/definitions';
import { PublicNextcloudKonvaImage } from '@/features/map_planning/components/image/PublicNextcloudKonvaImage';
import useMapStore from '@/features/map_planning/store/MapStore';
import { hideTooltip } from '@/features/map_planning/utils/Tooltip';
import { colors } from '@/utils/colors';
import { PlantLabel } from '../PlantLabel';
import { usePlanting } from './hooks';
import { placeTooltip } from './utils';

export type PlantingElementProps = {
  planting: PlantingDto;
};

/**
 * UI Component representing a single plant on the map.
 *
 * A single plant consists of a _Konva Group_ which itself is composed of:
 * In case of a single plant:
 * - A _Konva Circle_ filled with a selection-dependent colour
 * - A _Konva Image_ picturing the plant or showing a fallback image
 * In case of an area of plants:
 * - A _Konva Rect_ filled with a selection-dependent colour
 * - A _Konva Image_ picturing the plant or showing a fallback image
 *
 * @param planting - Plant's details used for rendering the plant.
 * @returns A plant ready to be shown on the map.
 *
 */
export function Planting({ planting }: PlantingElementProps) {
  const showPlantLabels = useMapStore((state) => state.untrackedState.layers.plants.showLabels);

  return (
    <>
      {planting.isArea ? (
        <AreaOfPlantings planting={planting} />
      ) : (
        <SinglePlanting planting={planting} />
      )}
      {showPlantLabels ? <PlantLabel planting={planting} key={planting.id} /> : null}
    </>
  );
}

/**
 * The component representing a single plant on the map.
 */
function SinglePlanting({ planting }: PlantingElementProps) {
  const { plant, isSelected, handleOnClick } = usePlanting(planting);
  const fillColor = colors.primary[400];

  return (
    <Group
      {...planting}
      planting={planting}
      draggable={true}
      onClick={handleOnClick}
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
function AreaOfPlantings({ planting }: PlantingElementProps) {
  const { plant, isSelected, handleOnClick } = usePlanting(planting);
  const fillColor = isSelected ? colors.secondary[200] : colors.purple[400];

  return (
    <Group
      {...planting}
      planting={planting}
      draggable={true}
      onClick={handleOnClick}
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
