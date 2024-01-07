import { SeedDto } from '@/api_types/definitions';
import { archiveSeed } from '@/features/seeds/api/archiveSeed';
import { createSeed } from '@/features/seeds/api/createSeed';
import { editSeed } from '@/features/seeds/api/editSeed';
import { findAllSeeds } from '@/features/seeds/api/findAllSeeds';
import { findSeedById } from '@/features/seeds/api/findSeedById';
import { errorToastGrouped, infoToastGrouped } from '@/features/toasts/groupedToast';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SEED_KEYS = {
  _helpers: {
    all: [{ entity: 'seeds' }] as const,
    details: () => [{ ...SEED_KEYS._helpers.all[0], scope: 'detail' }] as const,
    searches: () => [{ ...SEED_KEYS._helpers.all[0], scope: 'search' }] as const,
  },
  detail: (seedId: number) => [{ ...SEED_KEYS._helpers.details()[0], seedId }] as const,
  search: (searchTerm: string) => [{ ...SEED_KEYS._helpers.searches()[0], searchTerm }] as const,
};

/**
 * Load a seed from the backend using its id.
 *
 * @param seedId the id of the requested seed.
 * @param enabled will disable the backend query if set to false.
 * @param quiet will disable error modals if set to true.
 */
export function useFindSeedById({ seedId, enabled = true, quiet = false }: FindSeedByIdArgs) {
  const { t } = useTranslation(['seeds']);

  return useQuery({
    queryKey: SEED_KEYS.detail(seedId),
    queryFn: findSeedByIdQueryFn,
    meta: {
      autoClose: false,
      errorMessage: !quiet ? t('seeds:error_fetching_seed') : undefined,
    },
    enabled,
  });
}

type FindSeedByIdArgs = {
  seedId: number;
  enabled?: boolean;
  quiet?: boolean;
};

function findSeedByIdQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof SEED_KEYS)['detail']>>) {
  const { seedId } = queryKey[0];

  return findSeedById(seedId);
}

/**
 * A hook to search for seeds.
 * @returns an infinite query object and actions to search for seeds.
 */
export function useSeedSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
  const { t } = useTranslation(['seeds']);

  const queryInfo = useInfiniteQuery({
    queryKey: SEED_KEYS.search(debouncedSearchTerm),
    queryFn: searchSeedsQueryFn,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.total_pages > lastPage.page;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    getPreviousPageParam: () => undefined,
    meta: {
      autoClose: false,
      errorMessage: t('seeds:view_seeds.fetching_error'),
    },
  });

  const clearSearchTerm = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    queryInfo,
    actions: {
      searchSeeds: setSearchTerm,
      fetchNextPage: queryInfo.fetchNextPage,
      clearSearchTerm,
    },
  };
}

function searchSeedsQueryFn({
  pageParam = 1,
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof SEED_KEYS)['search']>>) {
  const { searchTerm } = queryKey[0];

  return findAllSeeds(pageParam, searchTerm);
}

/**
 * Mutations
 */

/**
 * A mutation to restore an archived seed.
 */
export function useRestoreSeed() {
  const { t } = useTranslation(['seeds', 'common']);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreSeedUsingSeedDto,
    onError: () => {
      errorToastGrouped(t('seeds:view_seeds.restore_seed_failure'));
    },
    onSuccess: () => queryClient.invalidateQueries([SEED_KEYS._helpers.all]),
  });
}

const restoreSeedUsingSeedDto = async (seed: SeedDto) =>
  archiveSeed(Number(seed.id), { archived: false });

/**
 * A mutation to archive a seed.
 */
export function useArchiveSeed() {
  const { t } = useTranslation(['seeds', 'common']);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveSeedUsingSeedDto,
    onError: () => {
      errorToastGrouped(t('seeds:create_seed_form.error_delete_seed'));
    },
    onSuccess: () => queryClient.invalidateQueries([SEED_KEYS._helpers.all]),
  });
}

const archiveSeedUsingSeedDto = async (seed: SeedDto) =>
  archiveSeed(Number(seed.id), { archived: true });

/**
 * A mutation to create a seed.
 */
export function useCreateSeed() {
  const { t } = useTranslation(['seeds', 'common']);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSeed,
    onError: (error) => {
      if (!(error instanceof AxiosError)) {
        return;
      }

      if (error.response?.status === 409) {
        infoToastGrouped(t('seeds:create_seed_form.error_seed_already_exists'));
        return;
      }

      infoToastGrouped(t('seeds:create_seed_form.error_create_seed'));
    },
    onSuccess: () => queryClient.invalidateQueries([SEED_KEYS._helpers.all]),
  });
}

/**
 * A mutation to edit a seed.
 */
export function useEditSeed() {
  const { t } = useTranslation(['seeds', 'common']);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editSeed,
    onSuccess: ({ id }) => queryClient.invalidateQueries([SEED_KEYS.detail(id)]),
    onError: (error) => {
      if (!(error instanceof AxiosError)) {
        return;
      }

      if (error.response?.status === 409) {
        errorToastGrouped(t('seeds:create_seed_form.error_seed_already_exists'));
        return;
      }

      errorToastGrouped(t('seeds:create_seed_form.error_create_seed'));
    },
  });
}
