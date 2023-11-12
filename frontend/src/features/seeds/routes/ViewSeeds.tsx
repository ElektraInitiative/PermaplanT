import { findAllSeeds } from '../api/findAllSeeds';
import SeedsOverviewList from '../components/SeedsOverviewList';
import { Page, SeedDto } from '@/api_types/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import SearchInput from '@/components/Form/SearchInput';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import { archiveSeed } from '@/features/seeds/api/archiveSeed';
import { errorToastGrouped } from '@/features/toasts/groupedToast';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ViewSeeds = () => {
  const navigate = useNavigate();

  // load seeds namespace for the translation
  const { t } = useTranslation(['seeds', 'common']);

  // Set the filter when the user types in the search input
  const [seedNameFilter, setSeedNameFilter] = useState<string>('');
  const debouncedNameFilter = useDebouncedValue(seedNameFilter, 200);
  const { fetchNextPage, data, isLoading, isFetching, error, refetch, hasNextPage } =
    useInfiniteQuery<Page<SeedDto>, Error>({
      queryKey: ['seeds', debouncedNameFilter],
      queryFn: ({ pageParam = 1, queryKey }) => findAllSeeds(pageParam, queryKey[1] as string),
      getNextPageParam: (lastPage) => {
        const hasMore = lastPage.total_pages > lastPage.page;
        return hasMore ? lastPage.page + 1 : undefined;
      },
      getPreviousPageParam: () => undefined,
    });
  if (error) {
    console.error(error.message);
    errorToastGrouped(t('seeds:view_seeds.fetching_error'));
  }
  const seeds = data?.pages.flatMap((page) => page.results) ?? [];

  const handleCreateSeedClick = () => {
    navigate('/seeds/create');
  };

  const pageFetcher = {
    hasNextPage,
    isLoading,
    isFetching,
    fetcher: fetchNextPage,
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSeedNameFilter(searchValue);
  };

  // Simple wrapper functions that allows us to submit a seed dto in place of just a seed id.
  const restoreSeedUsingSeedDto = async (seed: SeedDto) => {
    return await archiveSeed(Number(seed.id), { archived: false });
  };

  const archiveSeedUsingSeedDto = async (seed: SeedDto) => {
    return await archiveSeed(Number(seed.id), { archived: true });
  };

  const { mutate: handleRestoreSeed } = useMutation(['restore seed'], restoreSeedUsingSeedDto, {
    onError: () => {
      errorToastGrouped(t('seeds:view_seeds.restore_seed_failure'));
    },
    onSuccess: async (data, variables) => {
      const seed = variables as unknown as SeedDto;
      await refetch();
      toast.success(t('seeds:view_seeds.restore_seed_success', { seed: seed.name }));
    },
  });

  const { mutate: handleArchiveSeed } = useMutation(['archive seed'], archiveSeedUsingSeedDto, {
    onError: () => {
      errorToastGrouped(t('seeds:create_seed_form.error_delete_seed'));
    },
    onSuccess: async (data, variables) => {
      // archiveSeedUsingSeedDto takes SeedDto as its argument
      const seed = variables as unknown as SeedDto;

      await refetch();
      toast.success(
        <div>
          {t('seeds:view_seeds.restore_seed_message', { seed: seed.name })}
          <SimpleButton onClick={() => handleRestoreSeed(seed as SeedDto)}>
            {t('seeds:view_seeds.restore_seed_button')}
          </SimpleButton>
        </div>,
      );
    },
  });

  return (
    <Suspense>
      <PageLayout styleNames="flex flex-col space-y-4">
        <PageTitle title={t('seeds:view_seeds.title')} />
        <div className="flex flex-row justify-between space-x-6">
          <SearchInput
            placeholder={t('seeds:view_seeds.search_placeholder')}
            handleSearch={handleSearch}
          />
          <SimpleButton onClick={handleCreateSeedClick}>
            {t('seeds:view_seeds.btn_new_entry')}
          </SimpleButton>
        </div>
        <SeedsOverviewList
          seeds={seeds}
          handleArchiveSeed={(seed) => handleArchiveSeed(seed)}
          pageFetcher={pageFetcher}
        />
      </PageLayout>
    </Suspense>
  );
};
