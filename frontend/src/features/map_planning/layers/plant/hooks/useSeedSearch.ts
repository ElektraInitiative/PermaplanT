import { Page, SeedDto } from '@/api_types/definitions';
import { findAllSeeds } from '@/features/seeds/api/findAllSeeds';
import { errorToastGrouped } from '@/features/toasts/groupedToast';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useSeedSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
  const { t } = useTranslation(['seeds']);

  const { fetchNextPage, data, error, hasNextPage } = useInfiniteQuery<Page<SeedDto>, Error>({
    queryKey: ['seeds', debouncedSearchTerm],
    queryFn: ({ pageParam = 1, queryKey }) => findAllSeeds(pageParam, queryKey[1] as string),
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.total_pages > lastPage.page;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    getPreviousPageParam: () => undefined,
  });

  const clearSearchTerm = useCallback(() => {
    setSearchTerm('');
  }, []);

  if (error) {
    errorToastGrouped(t('seeds:view_seeds.fetching_error'), { autoClose: false });
  }

  return {
    seeds: data?.pages.flatMap((page) => page.results) ?? [],
    hasNextPage,
    actions: {
      searchSeeds: setSearchTerm,
      fetchNextPage,
      clearSearchTerm,
    },
  };
}
