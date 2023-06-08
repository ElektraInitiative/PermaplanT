import { PlantsSummaryDto } from '@/bindings/definitions';
import { ReactComponent as PlantIcon } from '@/icons/plant.svg';

export type PlantListElementProps = {
  plant: PlantsSummaryDto;
};

export function PlantListElement({ plant }: PlantListElementProps) {
  return (
    <li className="flex items-center gap-4 stroke-neutral-700 hover:stroke-primary-500 hover:text-primary-500 dark:stroke-neutral-700-dark">
      <PlantIcon />
      <span>
        <span className="mr-1 inline-block text-sm">{plant.unique_name}</span>
        <span className="inline-block text-sm">({plant.common_name_en})</span>
      </span>
    </li>
  );
}
