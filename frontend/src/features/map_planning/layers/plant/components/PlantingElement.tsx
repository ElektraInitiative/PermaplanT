import { useFindPlantById } from '../hooks/useFindPlantById';
import { PlantingDto } from '@/bindings/definitions';
import useMapStore from '@/features/map_planning/store/MapStore';
import PlantIcon from '@/icons/plant.svg';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Rect, Image } from 'react-konva';
import useImage from 'use-image';

export type PlantingElementProps = {
  planting: PlantingDto;
};

export function PlantingElement({ planting }: PlantingElementProps) {
  useFindPlantById(planting.plantId);

  const [imgData] = useImage(PlantIcon);
  const addShapeToTransformer = useMapStore((state) => state.addShapeToTransformer);
  const selectPlanting = useMapStore((state) => state.selectPlanting);

  return imgData ? (
    <Image
      {...planting}
      image={imgData}
      fill="green"
      onClick={(e) => {
        selectPlanting(planting);
        addShapeToTransformer(e.target as Shape<ShapeConfig>);
      }}
      onDragStart={(e) => {
        // sometimes the click event is not fired, so we have to add the object to the transformer here
        addShapeToTransformer(e.target as Shape<ShapeConfig>);
      }}
    />
  ) : (
    // Fallback to a rectangle if the image is not loaded yet
    <Rect {...planting} fill="green" />
  );
}
