import { useTranslation } from 'react-i18next';
import { Group, Circle, Rect } from 'react-konva';
import { PlantingDto } from '@/api_types/definitions';
import { PublicNextcloudKonvaImage } from '@/features/map_planning/components/image/PublicNextcloudKonvaImage';
import useMapStore from '@/features/map_planning/store/MapStore';
import { hideTooltip } from '@/features/map_planning/utils/Tooltip';
import { colors } from '@/utils/colors';
import { PlantLabel } from '../PlantLabel';
import { usePlanting } from './hooks';
import { placeTooltip } from './utils';

export type PlantingProps = {
  planting: PlantingDto;
};

/**
 * UI Component representing a single plant on the map.
 *
 * A single plant consists of a _Konva Group_ which itself is composed of:
 * In case of a single planting:
 * - A _Konva Circle_ filled with a selection-dependent colour
 * - A _Konva Image_ picturing the plant or showing a fallback image
 * In case of an area of plantings:
 * - A _Konva Rect_ filled with a selection-dependent colour
 * - A _Konva Image_ picturing the plant or showing a fallback image
 *
 * @param planting - Details used for rendering the plant.
 * @returns A plant ready to be shown on the map.
 *
 */
export function Planting({ planting }: PlantingProps) {
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
function SinglePlanting({ planting }: PlantingProps) {
  const { plant, isSelected, handleOnClick } = usePlanting(planting);
  const fillColor = isSelected ? colors.secondary[200] : colors.primary[400];
  const { i18n } = useTranslation();

  return (
    <Group
      planting={planting}
      {...planting}
      width={planting.sizeX}
      height={planting.sizeY}
      scaleX={1}
      scaleY={1}
      draggable={true}
      onClick={handleOnClick}
      onMouseOut={hideTooltip}
      onMouseMove={() => placeTooltip(plant, planting.additionalName, i18n.language)}
    >
      <Circle width={planting.sizeX} height={planting.sizeY} x={0} y={0} fill={fillColor} />
      {plant ? (
        <PublicNextcloudKonvaImage
          shareToken="2arzyJZYj2oNnHX"
          path={`Icons/${plant?.unique_name}.png`}
          width={planting.sizeX * 0.9}
          height={planting.sizeY * 0.9}
          offset={{ x: (planting.sizeX * 0.9) / 2, y: (planting.sizeY * 0.9) / 2 }}
          showErrorMessage={false}
        />
      ) : null}
    </Group>
  );
}

/**
 * The component representing an area of plants on the map.
 */
function AreaOfPlantings({ planting }: PlantingProps) {
  const { plant, isSelected, handleOnClick } = usePlanting(planting);
  const fillColor = isSelected ? colors.secondary[200] : colors.primary[600];
  const imageSize = Math.min(planting.sizeX, planting.sizeY) * 0.9;
  const { i18n } = useTranslation();

  return (
    <Group
      planting={planting}
      {...planting}
      width={planting.sizeX}
      height={planting.sizeY}
      scaleX={1}
      scaleY={1}
      draggable={true}
      onClick={handleOnClick}
      onMouseOut={hideTooltip}
      onMouseMove={() => placeTooltip(plant, planting.additionalName, i18n.language)}
    >
      <Rect width={planting.sizeX} height={planting.sizeY} fill={fillColor} cornerRadius={8} />
      {plant ? (
        <PublicNextcloudKonvaImage
          shareToken="2arzyJZYj2oNnHX"
          path={`Icons/${plant?.unique_name}.png`}
          width={imageSize}
          height={imageSize}
          offset={{
            x: -planting.sizeX / 2 + imageSize / 2,
            y: 0,
          }}
          showErrorMessage={false}
          draggable={false}
          listening={false}
        />
      ) : null}
    </Group>
  );
}
