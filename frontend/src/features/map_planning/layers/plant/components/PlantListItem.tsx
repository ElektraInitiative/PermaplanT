import { ExtendedPlantsSummaryDisplayName } from '../../../../../components/ExtendedPlantDisplay';
import defaultImageUrl from '@/assets/plant.svg';
import { PlantsSummaryDto } from '@/bindings/definitions';
import { PublicNextcloudImage } from '@/features/nextcloud_integration/components/PublicNextcloudImage';

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
    <li
      className="flex"
      data-testid={`${plant.common_name_en} ${plant.unique_name}-plant-search-result`}
    >
      <button
        onClick={() => onClick()}
        className={`${highlightedClass} flex flex-1 items-center gap-2 rounded-md stroke-neutral-400 px-2 py-1 hover:bg-neutral-200 hover:stroke-primary-400 hover:text-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:hover:bg-neutral-300-dark`}
      >
        <PublicNextcloudImage
          className="max-h-[44px] shrink-0"
          defaultImageUrl={defaultImageUrl}
          path={`Icons/${plant?.unique_name}.png`}
          shareToken="2arzyJZYj2oNnHX"
          retry={(failureCount, error) => error.response?.status !== 404}
          showErrorMessage={false}
        />
        <div className="text-left">
          <ExtendedPlantsSummaryDisplayName plant={plant}></ExtendedPlantsSummaryDisplayName>
        </div>
      </button>
    </li>
  );
}
