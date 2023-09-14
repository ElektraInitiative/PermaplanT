import { findAllSeeds } from '../api/findAllSeeds';
import SeedsOverviewList from '../components/SeedsOverviewList';
import { Page, SeedDto } from '@/bindings/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ViewSeeds = () => {
  const navigate = useNavigate();

  // load seeds namespace for the translation
  const { t } = useTranslation(['seeds', 'common']);

  // Set the filter when the user types in the search input
  const [seedNameFilter] = useState<string>('');
  const debouncedNameFilter = useDebouncedValue(seedNameFilter, 200);
  const { fetchNextPage, data, isLoading, isFetching, error, hasNextPage } = useInfiniteQuery<
    Page<SeedDto>,
    Error
  >({
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
    toast.error(t('seeds:view_seeds.fetching_error'));
  }
  const seeds = data?.pages.flatMap((page) => page.results) ?? [];

  const handleCreateSeedClick = () => {
    navigate('/seeds/new');
  };

  const pageFetcher = {
    hasNextPage,
    isLoading,
    isFetching,
    fetcher: fetchNextPage,
  };

  /*
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSeedNameFilter(searchValue);
  };
  */

  return (
    <Suspense>
      <PageLayout styleNames="flex flex-col space-y-4">
        <PageTitle title={t('seeds:view_seeds.title')} />
        {/* Search is currently disabled, please do not remove! */}
        {/* <span>{t('seeds:view_seeds.search_hint')}</span> */}
        <div className="flex flex-row justify-between space-x-6">
          {/* <SearchInput
            placeholder={t('seeds:view_seeds.search_placeholder')}
            handleSearch={handleSearch}
          /> */}
          <SimpleButton onClick={handleCreateSeedClick}>
            {t('seeds:view_seeds.btn_new_entry')}
          </SimpleButton>
        </div>
        <SeedsOverviewList seeds={seeds} pageFetcher={pageFetcher} />
      </PageLayout>
    </Suspense>
  );
};
