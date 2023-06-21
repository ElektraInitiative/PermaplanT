import { useFindPlantById } from '../hooks/useFindPlantById';
import { PlantingDto, PlantsSummaryDto } from '@/bindings/definitions';
import useMapStore from '@/features/map_planning/store/MapStore';
import PlantIcon from '@/icons/plant.svg';
import { Text } from 'konva/lib/shapes/Text';
import { Rect, Image, Group } from 'react-konva';
import { Html } from 'react-konva-utils';
import useImage from 'use-image';

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

  const [imgData] = useImage(PlantIcon);
  const addShapeToTransformer = useMapStore((state) => state.addShapeToTransformer);
  const selectPlanting = useMapStore((state) => state.selectPlanting);

  return imgData ? (
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
      {/* <Html>{plant?.unique_name}</Html> */}
      <Image
        width={planting.width}
        height={planting.height}
        x={0}
        y={0}
        image={imgData}
        fill="green"
      />
    </Group>
  ) : (
    // Fallback to a rectangle if the image is not loaded yet
    <Rect {...planting} fill="green" />
  );
}
