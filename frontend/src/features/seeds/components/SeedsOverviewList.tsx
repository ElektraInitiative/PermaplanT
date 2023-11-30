import { Quality, SeedDto } from '@/api_types/definitions';
import IconButton, { ButtonVariant } from '@/components/Button/IconButton';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { findPlantById } from '@/features/seeds/api/findPlantById';
import { useTranslateQuality } from '@/hooks/useTranslateQuality';
import { useTranslateQuantity } from '@/hooks/useTranslateQuantity';
import { ReactComponent as ArchiveIcon } from '@/svg/icons/archive-off.svg';
import { ReactComponent as EditIcon } from '@/svg/icons/edit.svg';
import { PlantNameFromSeedAndPlant } from '@/utils/plant-naming';
import { useQuery } from '@tanstack/react-query';
import { Suspense, UIEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
                    <td className="flex justify-between p-6">
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

const CompletePlantNameFromSeed = (props: { seed: SeedDto }) => {
  const { t } = useTranslation(['common']);

  const { isLoading, isError, data } = useQuery(
    ['plant', props.seed.plant_id],
    () => findPlantById(props.seed.plant_id ?? -1),
    { cacheTime: Infinity, staleTime: Infinity },
  );

  if (isLoading)
    return (
      <div className="w-[20px]">
        <LoadingSpinner />
      </div>
    );
  else if (isError) return <span>{t('common:error')}</span>;
  else return <PlantNameFromSeedAndPlant plant={data} seed={props.seed} />;
};

export default SeedsOverviewList;
