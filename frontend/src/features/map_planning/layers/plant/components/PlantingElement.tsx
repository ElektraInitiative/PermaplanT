import { useFindPlantById } from '../hooks/useFindPlantById';
import { PlantingDto, PlantsSummaryDto } from '@/bindings/definitions';
import useMapStore from '@/features/map_planning/store/MapStore';
import { Text } from 'konva/lib/shapes/Text';
import { Rect, Image, Group, Circle } from 'react-konva';
import { Html } from 'react-konva-utils';
import { NextcloudKonvaImage } from '@/features/map_planning/components/NextcloudKonvaImage';

export type PlantingElementProps = {
  planting: PlantingDto;
};

const mouseMoveHandler = (plant: PlantsSummaryDto | undefined) => {
  console.log('mouse move');
  let stageRef = useMapStore.getState().stageRef.current;
  let tooltipRef = useMapStore.getState().tooltipRef.current;
  if (!stageRef) return;
  if (!tooltipRef) return;
  if (!plant) return;
  // let mousePos = stageRef.getPointerPosition();
  let mousePos = stageRef.getRelativePointerPosition();
  if (!mousePos) return;
  tooltipRef.position({
    x: mousePos.x + 5,
    y: mousePos.y + 5,
  });
  tooltipRef.findOne<Text>('Text').text(plant.unique_name);
  tooltipRef.show();
};

const mouseOutHandler = () => {
  let tooltipRef = useMapStore.getState().tooltipRef.current;
  tooltipRef?.hide();
};

export function PlantingElement({ planting }: PlantingElementProps) {
  const { plant } = useFindPlantById(planting.plantId);

  const addShapeToTransformer = useMapStore((state) => state.addShapeToTransformer);
  const selectPlanting = useMapStore((state) => state.selectPlanting);

  return (
    <Group
      {...planting}
      draggable
      onClick={(e) => {
        addShapeToTransformer(e.currentTarget);
        selectPlanting(planting);
      }}
      onDragStart={(e) => {
        // sometimes the click event is not fired, so we have to add the object to the transformer here
        addShapeToTransformer(e.currentTarget);
      }}
      onMouseOut={mouseOutHandler}
      onMouseMove={() => mouseMoveHandler(plant)}
    >
      <Circle
        width={planting.width}
        height={planting.height}
        x={0}
        y={0}
        fill="#6f9e48"
      />
      <NextcloudKonvaImage
        width={planting.width * 0.9}
        height={planting.height * 0.9}
        offset={{x: (planting.width * 0.9)/2, y: (planting.height * 0.9)/2}}
      />
    </Group>
  )
}
