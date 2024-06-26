import { Suspense, UIEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Quality, SeedDto } from '@/api_types/definitions';
import IconButton, { ButtonVariant } from '@/components/Button/IconButton';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { useFindPlantById } from '@/features/map_planning/layers/plant/hooks/plantHookApi';
import { useTranslateQuality } from '@/hooks/useTranslateQuality';
import { useTranslateQuantity } from '@/hooks/useTranslateQuantity';
import ArchiveIcon from '@/svg/icons/archive-off.svg?react';
import EditIcon from '@/svg/icons/edit.svg?react';
import { PlantNameFromSeedAndPlant } from '@/utils/plant-naming';

interface SeedsOverviewListProps {
  seeds: SeedDto[];
  handleArchiveSeed: (seed: SeedDto) => void;
  pageFetcher: {
    isLoading: boolean;
    isFetching: boolean;
    fetcher: () => Promise<unknown>;
    hasNextPage: boolean | undefined;
  };
}

const SeedsOverviewList = ({ seeds, handleArchiveSeed, pageFetcher }: SeedsOverviewListProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['seeds', 'common']);
  const translateQuality = useTranslateQuality();
  const translateQuantity = useTranslateQuantity();

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      ref?.current?.clientHeight === ref?.current?.scrollHeight &&
      pageFetcher.hasNextPage &&
      !pageFetcher.isLoading &&
      !pageFetcher.isFetching
    ) {
      pageFetcher.fetcher();
    }
  }, [ref, pageFetcher]);

  const handleScroll = async (event: UIEvent<EventTarget>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.scrollTop + target.clientHeight === target.scrollHeight) {
      await pageFetcher.fetcher();
    }
  };

  const handleEditSeed = (seed: SeedDto) => {
    navigate(`/seeds/${seed.id}/edit`);
  };

  return (
    <Suspense>
      <section>
        <div
          className="relative overflow-auto rounded-lg"
          style={{ height: '75vh' }}
          onScroll={handleScroll}
          ref={ref}
        >
          <table className="w-full bg-gray-200 text-left text-sm dark:bg-neutral-300-dark">
            <thead className="text-xs uppercase text-neutral-300">
              <tr>
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:binomial_name')}
                </th>
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:quantity')}
                </th>
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:quality')}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:harvest_year')}
                </th>
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:origin')}
                </th>
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {seeds.length === 0 ? (
                <tr>
                  <td className="py-4 text-center">{t('seeds:error_fetching_seed')}</td>
                </tr>
              ) : (
                seeds.map((seed) => (
                  <tr
                    key={seed.id}
                    className="bg-primary-textfield dark:hover-bg-neutral-600 hover:bg-neutral-300"
                  >
                    <td className="px-6 py-4">
                      {seed.plant_id ? (
                        <CompletePlantNameFromSeed seed={seed} />
                      ) : (
                        <span>{t('common:error')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{translateQuantity(seed.quantity)}</td>
                    <td className="px-6 py-4">
                      {translateQuality(seed.quality ?? ('unknown' as Quality))}
                    </td>
                    <td className="px-6 py-4">{seed.harvest_year}</td>
                    <td className="px-6 py-4">{seed.origin}</td>
                    <td className="flex justify-between px-6 py-6">
                      <IconButton
                        variant={ButtonVariant.primary}
                        onClick={() => handleEditSeed(seed)}
                        title={t('seeds:view_seeds.edit_seed_tooltip')}
                        data-testid="seed-overview-list__edit-button"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        variant={ButtonVariant.primary}
                        onClick={() => {
                          handleArchiveSeed(seed);
                        }}
                        title={t('seeds:view_seeds.archive_seed_tooltip')}
                        data-testid="seed-overview-list__archive-button"
                      >
                        <ArchiveIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Suspense>
  );
};

const CompletePlantNameFromSeed = ({ seed }: { seed: SeedDto }) => {
  const { t } = useTranslation(['common']);
  const { i18n } = useTranslation();

  const {
    data: plant,
    isLoading: isPlantLoading,
    isError: hasPlantError,
  } = useFindPlantById({
    // cast is fine because the query can only execute if plant_id is defined
    plantId: seed.plant_id as number,
    enabled: seed.plant_id !== undefined,
  });

  if (isPlantLoading)
    return (
      <div className="w-[20px]">
        <LoadingSpinner />
      </div>
    );
  else if (hasPlantError) return <span>{t('common:error')}</span>;
  else return <PlantNameFromSeedAndPlant plant={plant} seed={seed} language={i18n.language} />;
};

export default SeedsOverviewList;
