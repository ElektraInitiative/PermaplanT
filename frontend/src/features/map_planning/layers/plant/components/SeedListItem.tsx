import { SeedDto } from '@/api_types/definitions';
import { useFindPlantById } from '@/features/map_planning/layers/plant/hooks/useFindPlantById';
import { PublicNextcloudImage } from '@/features/nextcloud_integration/components/PublicNextcloudImage';
import defaultImageUrl from '@/svg/plant.svg';
import { PlantNameFromSeedAndPlant } from '@/utils/plant-naming';
import { toast } from 'react-toastify';

export type SeedListElementProps = {
  seed: SeedDto;
  onClick: () => void;
  isHighlighted?: boolean;
  disabled?: boolean;
};

export function SeedListItem({
  seed,
  onClick,
  isHighlighted = false,
  disabled,
}: SeedListElementProps) {
  const highlightedClass = isHighlighted
    ? 'text-primary-400 stroke-primary-400 ring-4 ring-primary-300 '
    : undefined;

  if (!seed.plant_id) {
    // Ideally, this should never happen.
    toast.error('Tried to initialize SeedListItem with missing plant_id');
  }

  const { plant } = useFindPlantById(seed.plant_id ?? -1);

  // The user should already be provided with an error toast
  // by useFindPlantById.
  if (!plant) return null;

  return (
    <li className="my-1 flex" data-testid={`${seed.name}-plant-search-result`}>
      <button
        disabled={disabled}
        onClick={() => onClick()}
        className={`${highlightedClass} flex flex-1 items-center gap-2 rounded-md stroke-neutral-400 px-2 py-1 hover:bg-neutral-200 hover:stroke-primary-400 hover:text-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-300 disabled:text-neutral-500 dark:hover:bg-neutral-300-dark dark:disabled:border-neutral-300-dark dark:disabled:bg-neutral-300-dark dark:disabled:text-neutral-500-dark`}
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
          <PlantNameFromSeedAndPlant seed={seed} plant={plant} />
        </div>
      </button>
    </li>
  );
}