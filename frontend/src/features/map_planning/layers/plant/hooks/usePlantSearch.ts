import { searchPlants } from '@/features/seeds/api/searchPlants';
import { errorToastGrouped } from '@/features/toasts/groupedToast';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function usePlantSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
  const { t } = useTranslation(['plantSearch']);
  const { data } = useQuery(['plants/search', debouncedSearchTerm] as const, {
    queryFn: ({ queryKey: [, search] }) => searchPlants(search, 0),
    meta: {
      autoClose: false,
      errorMessage: t('plantSearch:error_searching_plants'),
    },
    // prevent the query from being fetched again for the
    // same search term. plants are not expected to change
    staleTime: Infinity,
    // keep the previous data while the new data is being fetched, prevents flickering
    keepPreviousData: true,
  });

  const clearSearchTerm = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    plants: data?.results ?? [],
    actions: {
      searchPlants: setSearchTerm,
      clearSearchTerm,
    },
  };
}
