import { Quality, SeedDto } from '@/api_types/definitions';
import IconButton, { ButtonVariant } from '@/components/Button/IconButton';
import { ExtendedPlantsSummaryDisplayName } from '@/components/ExtendedPlantDisplay';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { findPlantById } from '@/features/seeds/api/findPlantById';
import { useTranslateQuality } from '@/hooks/useTranslateQuality';
import { useTranslateQuantity } from '@/hooks/useTranslateQuantity';
import { ReactComponent as ArchiveIcon } from '@public/icons/archive-off.svg';
import { ReactComponent as EditIcon } from '@public/icons/edit.svg';
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
              {seeds.map((seed) => (
                <tr
                  key={seed.id}
                  className="bg-primary-textfield hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                  <td className="px-6 py-4">
                    {seed.plant_id ? (
                      <ExtendedPlantsSummaryDisplayNameForSeeds
                        plantId={seed.plant_id ?? 0}
                        seed={seed}
                      />
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
                  <td className="flex flex-row justify-between px-6 py-4">
                    <IconButton
                      variant={ButtonVariant.primary}
                      onClick={() => handleEditSeed(seed)}
                      title={t('seeds:view_seeds.edit_seed_tooltip')}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      variant={ButtonVariant.primary}
                      onClick={() => {
                        handleArchiveSeed(seed);
                      }}
                      title={t('seeds:view_seeds.archive_seed_tooltip')}
                    >
                      <ArchiveIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Suspense>
  );
};

const ExtendedPlantsSummaryDisplayNameForSeeds = (props: { plantId: number; seed: SeedDto }) => {
  const { t } = useTranslation(['common']);

  const { isLoading, isError, data } = useQuery(
    ['plant', props.plantId],
    () => findPlantById(props.plantId),
    { cacheTime: Infinity, staleTime: Infinity },
  );

  if (isLoading)
    return (
      <div className="w-[20px]">
        <LoadingSpinner />
      </div>
    );
  else if (isError) return <span>{t('common:error')}</span>;
  else return <ExtendedPlantsSummaryDisplayName plant={data} seed={props.seed} />;
};

export default SeedsOverviewList;
