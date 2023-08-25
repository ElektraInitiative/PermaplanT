import { SeedDto } from '@/bindings/definitions';
import { ExtendedPlantsSummaryDisplayName } from '@/components/ExtendedPlantDisplay';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { findPlantById } from '@/features/seeds/api/findPlantById';
import { useQuery } from '@tanstack/react-query';
import { Suspense, UIEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface SeedsOverviewListProps {
  seeds: SeedDto[];
  pageFetcher: { isLoading: boolean; isFetching: boolean; fetcher: () => Promise<unknown> };
}

const SeedsOverviewList = ({ seeds, pageFetcher }: SeedsOverviewListProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['seeds', 'common']);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      ref?.current?.clientHeight === ref?.current?.scrollHeight &&
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

  const handleSeedClick = (seed: SeedDto) => {
    navigate(`/seeds/${seed.id}`);
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
                  {t('seeds:seed_name')}
                </th>
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:binomial_name')}
                </th>
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:quantity')}
                </th>
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:quality')}
                </th>
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:harvest_year')}
                </th>
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
                  {t('seeds:origin')}
                </th>
              </tr>
            </thead>
            <tbody>
              {seeds.map((seed) => (
                <tr
                  key={seed.id}
                  className="bg-primary-textfield cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-600"
                  onClick={() => {
                    handleSeedClick(seed);
                  }}
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-neutral-900 dark:text-white"
                  >
                    {seed.name}
                  </th>
                  <td className="px-6 py-4">
                    {seed.plant_id ? (
                      <ExtendedPlantsSummaryDisplayNameForSeeds plantId={seed.plant_id ?? 0} />
                    ) : (
                      <span>{t('common:error')}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{seed.quantity}</td>
                  <td className="px-6 py-4">{seed.quality}</td>
                  <td className="px-6 py-4">{seed.harvest_year}</td>
                  <td className="px-6 py-4">{seed.origin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Suspense>
  );
};

const ExtendedPlantsSummaryDisplayNameForSeeds = (props: { plantId: number }) => {
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
  else return <ExtendedPlantsSummaryDisplayName plant={data} />;
};

export default SeedsOverviewList;
