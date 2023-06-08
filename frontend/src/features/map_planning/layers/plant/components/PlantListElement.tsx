import { PlantsSummaryDto } from '@/bindings/definitions';

export type PlantListElementProps = {
  plant: PlantsSummaryDto;
};

export function PlantListElement({ plant }: PlantListElementProps) {
  return <div>{plant.unique_name}</div>;
}
