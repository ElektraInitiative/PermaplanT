import { SeedDto } from '@/bindings/definitions';
import IconButton, { ButtonVariant } from '@/components/Button/IconButton';
import { ExtendedPlantsSummaryDisplayName } from '@/components/ExtendedPlantDisplay';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { deleteSeed } from '@/features/seeds/api/deleteSeed';
import { findPlantById } from '@/features/seeds/api/findPlantById';
import { ReactComponent as EditIcon } from '@/icons/edit.svg';
import { ReactComponent as TrashIcon } from '@/icons/trash.svg';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Suspense, UIEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

  const handleEditSeed = (seed: SeedDto) => {
    navigate(`/seeds/${seed.id}/edit`);
  };

  const deleteSeedFunc = async (seed: SeedDto) => {
    try {
      await deleteSeed(Number(seed.id));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const { mutate: handleDeleteSeed } = useMutation<unknown, unknown, SeedDto, unknown>(
    ['delete seed'],
    deleteSeedFunc,
    {
      onError: () => {
        toast(t('seeds:create_seed_form.error_delete_seed'));
      },
      onSuccess: () => {
        // Reload the page to make sure the updates are actually displayed to the user.
        window.location.reload();
      },
    },
  );

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
                <th scope="col" className="px-6 py-3 dark:bg-neutral-200-dark">
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
                  <td className="px-6 py-4">{seed.quantity}</td>
                  <td className="px-6 py-4">{seed.quality}</td>
                  <td className="px-6 py-4">{seed.harvest_year}</td>
                  <td className="px-6 py-4">{seed.origin}</td>
                  <td className="flex flex-row justify-between px-6 py-4">
                    <IconButton
                      variant={ButtonVariant.primary}
                      onClick={() => handleEditSeed(seed)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      variant={ButtonVariant.primary}
                      onClick={() => handleDeleteSeed(seed)}
                    >
                      <TrashIcon />
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
