import { useFindPlantById } from '../hooks/useFindPlantById';
import { ExtendedPlantsSummary } from './ExtendedPlantDisplay';
import { PlantingDto, PlantsSummaryDto } from '@/bindings/definitions';
import { PublicNextcloudKonvaImage } from '@/features/map_planning/components/image/PublicNextcloudKonvaImage';
import useMapStore from '@/features/map_planning/store/MapStore';
import {
  setTooltipPositionToMouseCursor,
  showTooltipWithContent,
  hideTooltip,
} from '@/features/map_planning/utils/Tooltip';
import { Group, Circle, Rect } from 'react-konva';

export type PlantingElementProps = {
  planting: PlantingDto;
};

const placeTooltip = (plant: PlantsSummaryDto | undefined) => {
  if (!plant) return;

  setTooltipPositionToMouseCursor();

  const extendedPlant = new ExtendedPlantsSummary(plant);
  showTooltipWithContent(extendedPlant.displayName.common_name);
};

export function PlantingElement({ planting }: PlantingElementProps) {
  const { plant } = useFindPlantById(planting.plantId);

  const addShapeToTransformer = useMapStore((state) => state.addShapeToTransformer);
  const selectPlanting = useMapStore((state) => state.selectPlanting);

  const selectedPlanting = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlanting,
  );

  return (
    <Group
      {...planting}
      planting={planting}
      onClick={(e) => {
        const placeEvent = new Event('selectPlant');
        document.getElementById('canvas')?.dispatchEvent(placeEvent);
        addShapeToTransformer(e.currentTarget);
        selectPlanting(planting);
      }}
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
