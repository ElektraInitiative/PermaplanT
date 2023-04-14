import { findAllSeeds } from '../api/findAllSeeds';
import SeedsOverviewList from '../components/SeedsOverviewList';
import { Page, SeedDto } from '@/bindings/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import SearchInput from '@/components/Form/SearchInput';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import SimpleModal from '@/components/Modals/SimpleModal';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

export const ViewSeeds = () => {
  const navigate = useNavigate();

  // load seeds namespace for the translation
  const { t } = useTranslation(['seeds', 'common']);

  const { fetchNextPage, data, isLoading, isFetching, error } = useInfiniteQuery<
    Page<SeedDto>,
    Error
  >({
    queryKey: ['seeds'],
    queryFn: ({ pageParam = 1 }) => findAllSeeds(pageParam),
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.total_pages > lastPage.page;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    getPreviousPageParam: () => undefined,
  });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const seeds = data?.pages.flatMap((page) => page.results) ?? [];

  // Set the filter when the user types in the search input
  const [_, setFilteredSeeds] = useState<SeedDto[]>([]);

  const handleCreateSeedClick = () => {
    navigate('/seeds/new');
  };

  const pageFetcher = {
    isLoading,
    isFetching,
    fetcher: fetchNextPage,
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    const temp = seeds.filter(
      (seed) =>
        seed.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        seed.harvest_year.toString().toLowerCase().includes(searchValue.toLowerCase()),
    );
    setFilteredSeeds(temp);
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
        <SeedsOverviewList seeds={seeds} pageFetcher={pageFetcher} />
        <SimpleModal
          title={t('seeds:error_modal_title')}
          body={error?.message || t('common:unknown_error')} // Error should always have a message
          show={showErrorModal}
          setShow={setShowErrorModal}
          submitBtnTitle={t('common:ok')}
          onSubmit={() => {
            setShowErrorModal(false);
          }}
        ></SimpleModal>
      </PageLayout>
    </Suspense>
  );
};
