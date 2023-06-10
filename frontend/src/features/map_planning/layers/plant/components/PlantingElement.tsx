import { PlantingDto } from '@/bindings/definitions';
import useMapStore from '@/features/map_planning/store/MapStore';
import { findPlantById } from '@/features/seeds/api/findPlantById';
import PlantIcon from '@/icons/plant.svg';
import { useQuery } from '@tanstack/react-query';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Rect, Image } from 'react-konva';
import useImage from 'use-image';

export type PlantingElementProps = {
  planting: PlantingDto;
};

export function PlantingElement({ planting }: PlantingElementProps) {
  const [imgData] = useImage(PlantIcon);
  const { data: _ } = useQuery(['plants/plant', planting.plantId] as const, {
    queryFn: (context) => findPlantById(context.queryKey[1]),
    staleTime: Infinity,
  });

  const addShapeToTransformer = useMapStore((state) => state.addShapeToTransformer);
  const selectPlanting = useMapStore((state) => state.selectPlanting);
  const selectPlantForPlanting = useMapStore((state) => state.selectPlantForPlanting);

  return imgData ? (
    <Image
      {...planting}
      image={imgData}
      fill="green"
      onClick={(e) => {
        addShapeToTransformer(e.target as Shape<ShapeConfig>);
      }}
      onDragStart={(e) => {
        // sometimes the click event is not fired, so we have to add the object to the transformer here
        addShapeToTransformer(e.target as Shape<ShapeConfig>);
      }}
      onPointerClick={() => {
        selectPlantForPlanting(null);
        selectPlanting(planting);
      }}
    />
  ) : (
    // Fallback to a rectangle if the image is not loaded yet
    <Rect
      {...planting}
      fill="green"
      onClick={(e) => {
        addShapeToTransformer(e.target as Shape<ShapeConfig>);
      }}
      onDragStart={(e) => {
        // sometimes the click event is not fired, so we have to add the object to the transformer here
        addShapeToTransformer(e.target as Shape<ShapeConfig>);
      }}
      onPointerClick={() => {
        selectPlantForPlanting(null);
        selectPlanting(planting);
      }}
    />
  );
}
