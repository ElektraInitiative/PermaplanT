import { useFindPlantById } from '../hooks/useFindPlantById';
import { PlantingDto, PlantsSummaryDto } from '@/bindings/definitions';
import { PublicNextcloudKonvaImage } from '@/features/map_planning/components/image/PublicNextcloudKonvaImage';
import useMapStore from '@/features/map_planning/store/MapStore';
import { setTooltipPosition } from '@/features/map_planning/utils/Tooltip';
import { Text } from 'konva/lib/shapes/Text';
import { Group, Circle, Rect } from 'react-konva';

export type PlantingElementProps = {
  planting: PlantingDto;
};

const placeTooltip = (plant: PlantsSummaryDto | undefined) => {
  const stage = useMapStore.getState().stageRef.current;
  const tooltip = useMapStore.getState().tooltipRef.current;
  if (!stage || !tooltip || !plant) return;

  setTooltipPosition(tooltip, stage);

  tooltip.findOne<Text>('Text').text(plant.unique_name);
  tooltip.show();
};

const hideTooltip = () => {
  const tooltip = useMapStore.getState().tooltipRef.current;
  tooltip?.hide();
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
      draggable
      onClick={(e) => {
        addShapeToTransformer(e.currentTarget);
        selectPlanting(planting);
      }}
      onDragStart={(e) => {
        // sometimes the click event is not fired, so we have to add the object to the transformer here
        addShapeToTransformer(e.currentTarget);
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
        />
      ) : (
        <Rect width={0} height={0} />
      )}
    </Group>
  );
}
