import { findAllSeeds } from '../api/findAllSeeds';
import SeedsOverviewList from '../components/SeedsOverviewList';
import { NewSeedDto, Page, SeedDto } from '@/bindings/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import SearchInput from '@/components/Form/SearchInput';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import SimpleModal from '@/components/Modals/SimpleModal';
import { createSeed } from '@/features/seeds/api/createSeed';
import { deleteSeed } from '@/features/seeds/api/deleteSeed';
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
  const { fetchNextPage, data, isLoading, isFetching, error, refetch } = useInfiniteQuery<
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
    isLoading,
    isFetching,
    fetcher: fetchNextPage,
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSeedNameFilter(searchValue);
  };

  const { mutate: handleRestoreSeed } = useMutation(['restore seed'], createSeed, {
    onError: () => {
      toast.error(t('seeds:view_seeds.restore_seed_failure'));
    },
    onSuccess: async (data, variables) => {
      const seed = variables as unknown as SeedDto;
      await refetch();
      toast.success(t('seeds:view_seeds.restore_seed_success', { seed: seed.name }));
    },
  });

  // Simple wrapper function that allows us to submit a seed dto in place of just a seed id.
  const deleteSeedUsingSeedDto = async (seed: SeedDto) => {
    return await deleteSeed(Number(seed.id));
  };

  const { mutate: handleDeleteSeed } = useMutation(['delete seed'], deleteSeedUsingSeedDto, {
    onError: () => {
      toast.error(t('seeds:create_seed_form.error_delete_seed'));
    },
    onSuccess: async (data, variables) => {
      // deleteSeedUsingSeedDto takes SeedDto as its argument
      const seed = variables as unknown as SeedDto;

      await refetch();
      toast.success(
        <div>
          {t('seeds:view_seeds.restore_seed_message', { seed: seed.name })}
          <SimpleButton onClick={() => handleRestoreSeed(seed as NewSeedDto)}>
            {t('seeds:view_seeds.restore_seed_button')}
          </SimpleButton>
        </div>,
      );
    },
  });

  type SeedModalStateType = {
    /** Whether the modal should be shown. */
    show: boolean;
    /** Which seed will be deleted. */
    seed: SeedDto | null;
  };

  const [deleteSeedModalState, setDeleteSeedModalState] = useState<SeedModalStateType>({
    show: false,
    seed: null,
  });

  return (
    <Suspense>
      <PageLayout styleNames="flex flex-col space-y-4">
        <PageTitle title={t('seeds:view_seeds.title')} />
        <span>{t('seeds:view_seeds.search_hint')}</span>
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
          handleDeleteSeed={(seed) => {
            setDeleteSeedModalState({ show: true, seed: seed });
          }}
          pageFetcher={pageFetcher}
        />
      </PageLayout>
      {/* Confirm Delete modal */}
      <SimpleModal
        title={t('seeds:view_seeds.confirm_deletion_modal_title', {
          seed: deleteSeedModalState.seed?.name,
        })}
        body={t('seeds:view_seeds.confirm_deletion_modal_body', {
          seed: deleteSeedModalState.seed?.name,
        })}
        setShow={(show) => setDeleteSeedModalState((state) => ({ seed: state.seed, show: show }))}
        show={deleteSeedModalState.show}
        submitBtnTitle={t('common:yes')}
        onSubmit={() => {
          if (deleteSeedModalState.seed) handleDeleteSeed(deleteSeedModalState.seed);
          setDeleteSeedModalState({ seed: null, show: false });
        }}
        cancelBtnTitle={t('common:no')}
        onCancel={() => {
          setDeleteSeedModalState({ seed: null, show: false });
        }}
      />
    </Suspense>
  );
};
