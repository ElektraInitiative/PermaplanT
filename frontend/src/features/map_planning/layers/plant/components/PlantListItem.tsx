import { PlantsSummaryDto } from '@/bindings/definitions';
import { ReactComponent as PlantIcon } from '@/icons/plant.svg';

export type PlantListElementProps = {
  plant: PlantsSummaryDto;
  onClick: () => void;
};

export function PlantListItem({ plant, onClick }: PlantListElementProps) {
  return (
    <li className="flex">
      <button
        onClick={() => onClick()}
        className="flex flex-1 items-center gap-2 rounded-md stroke-neutral-400 px-2 py-1 hover:bg-neutral-200 hover:stroke-primary-400 hover:text-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:hover:bg-neutral-300-dark"
      >
        <PlantIcon className="shrink-0" />
        <div className="text-left">
          <span className="mr-1 inline-block text-sm">{plant.unique_name}</span>
          {plant.common_name_en && (
            <span className="inline-block text-sm">({plant.common_name_en})</span>
          )}
        </div>
      </button>
    </li>
  );
}
