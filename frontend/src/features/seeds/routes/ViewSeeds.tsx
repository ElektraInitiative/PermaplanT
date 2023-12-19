import { RestoreSeedButton } from '../components/RestoreSeedButton';
import SeedsOverviewList from '../components/SeedsOverviewList';
import { SeedDto } from '@/api_types/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import SearchInput from '@/components/Form/SearchInput';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import { useArchiveSeed, useSeedSearch } from '@/features/seeds/hooks/seedHookApi';
import { Suspense, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ViewSeeds = () => {
  const navigate = useNavigate();

  const { t } = useTranslation(['seeds', 'common']);

  const {
    queryInfo: { data, hasNextPage, isLoading, isFetching },
    actions,
  } = useSeedSearch();

  const { mutate: archiveSeed } = useArchiveSeed();

  const handleArchiveSeed = useCallback(
    (seed: SeedDto) => {
      archiveSeed(seed, {
        onSuccess: (seed) => {
          toast.success(() => <RestoreSeedButton seed={seed} />);
        },
      });
    },
    [archiveSeed],
  );

  const seeds = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data]);

  const handleSearch = (value: string) => {
    const searchValue = value.toLowerCase();
    actions.searchSeeds(searchValue);
  };

  const handleCreateSeedClick = () => {
    navigate('/seeds/create');
  };

  const pageFetcher = {
    hasNextPage,
    isLoading,
    isFetching,
    fetcher: actions.fetchNextPage,
  };

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
