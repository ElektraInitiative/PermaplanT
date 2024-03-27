import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { searchUsers } from '../api/searchUsers';

const USER_KEYS = {
  _helpers: {
    all: [{ entity: 'user' }] as const,
    searches: () => [{ ...USER_KEYS._helpers.all[0], scope: 'search' }] as const,
  },
  search: (searchTerm: string) => [{ ...USER_KEYS._helpers.searches()[0], searchTerm }] as const,
};

/**
 * Search for users by their username.
 */
export function useSearchUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
  // TODO: add translations, add pagination
  // const { t } = useTranslation(['']);

  const queryInfo = useQuery({
    queryKey: USER_KEYS.search(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 0,
    queryFn: searchUsersQueryFn,
    meta: {
      autoClose: false,
      errorMessage: 'Error fetching users',
      toastId: 'fetchError',
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
    queryInfo,
    actions: {
      searchUsers: setSearchTerm,
      clearSearchTerm,
    },
  };
}

function searchUsersQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof USER_KEYS)['search']>>) {
  const { searchTerm } = queryKey[0];

  return searchUsers(searchTerm);
}
