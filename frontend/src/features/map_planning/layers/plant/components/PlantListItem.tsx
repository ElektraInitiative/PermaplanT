import ExtendedPlantsSummaryDisplayName from './ExtendedPlantDisplay';
import { PlantsSummaryDto } from '@/bindings/definitions';
import { ReactComponent as PlantIcon } from '@/icons/plant.svg';

export type PlantListElementProps = {
  /** The plant that is displayed as element of a list */
  plant: PlantsSummaryDto;
  /** Callback when the element is clicked */
  onClick: () => void;
  /** Whether the element is highlighted */
  isHighlighted?: boolean;
};

/**
 * A list element for a list of plants
 */
export function PlantListItem({ plant, onClick, isHighlighted = false }: PlantListElementProps) {
  const highlightedClass = isHighlighted
    ? 'text-primary-400 stroke-primary-400 ring-4 ring-primary-300 '
    : undefined;

  return (
    <li className="flex">
      <button
        onClick={() => onClick()}
        className={`${highlightedClass} flex flex-1 items-center gap-2 rounded-md stroke-neutral-400 px-2 py-1 hover:bg-neutral-200 hover:stroke-primary-400 hover:text-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:hover:bg-neutral-300-dark`}
      >
        <PlantIcon className="shrink-0" />
        <div className="text-left">
          <ExtendedPlantsSummaryDisplayName plant={plant}></ExtendedPlantsSummaryDisplayName>
        </div>
      </button>
    </li>
  );
}
