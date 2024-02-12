import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { searchUsers } from '../api/searchUsers';

const USER_KEYS = {
  _helpers: {
    all: [{ entity: 'user' }] as const,
    searches: () => [{ ...USER_KEYS._helpers.all[0], scope: 'search' }] as const,
  },
  searches: (searchTerm: string) => [{ ...USER_KEYS._helpers.searches()[0], searchTerm }] as const,
};

/**
 * Search for users by their username given a search term.
 */
export function useSearchUsers(searchTerm: string) {
  return useQuery({
    queryKey: USER_KEYS.searches(searchTerm),
    queryFn: searchUsersQueryFn,
    meta: {
      errorMessage: 'Error fetching users',
      autoClose: false,
      toastId: 'fetchError',
    },
  });
}

function searchUsersQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof USER_KEYS)['searches']>>) {
  const { searchTerm } = queryKey[0];

  return searchUsers(searchTerm);
}
