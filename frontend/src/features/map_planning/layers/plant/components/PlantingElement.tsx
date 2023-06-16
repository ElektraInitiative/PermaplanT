import { useFindPlantById } from '../hooks/useFindPlantById';
import { PlantingDto } from '@/bindings/definitions';
import useMapStore from '@/features/map_planning/store/MapStore';
import PlantIcon from '@/icons/plant.svg';
import { Rect, Image, Group } from 'react-konva';
import { Html } from 'react-konva-utils';
import useImage from 'use-image';

export type PlantingElementProps = {
  planting: PlantingDto;
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
    >
      <Html>{plant?.unique_name}</Html>
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
