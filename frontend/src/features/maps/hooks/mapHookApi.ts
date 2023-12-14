import { createMap } from '../api/createMap';
import { findAllMaps } from '../api/findAllMaps';
import { findMapById } from '../api/findMapById';
import { updateMap } from '../api/updateMap';
import { MapSearchParameters } from '@/api_types/definitions';
import { errorToastGrouped } from '@/features/toasts/groupedToast';
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const MAP_KEYS = {
  _helpers: {
    all: [{ entity: 'map' }] as const,
    details: () => [{ ...MAP_KEYS._helpers.all[0], scope: 'detail' }] as const,
    searches: () => [{ ...MAP_KEYS._helpers.all[0], scope: 'search' }] as const,
  },
  detail: (mapId: number) => [{ ...MAP_KEYS._helpers.details()[0], mapId }] as const,
  // `searchParams` is spread into the queryKey, so fuzzy invalidation is possible
  search: (searchParams: MapSearchParameters) =>
    [{ ...MAP_KEYS._helpers.searches()[0], ...searchParams }] as const,
};

/**
 * Load a map from the backend using its id.
 *
 * @param mapId the id of the requested map.
 */
export function useFindMapById(mapId: number) {
  const { t } = useTranslation(['maps']);

  return useQuery({
    queryKey: MAP_KEYS.detail(mapId),
    queryFn: findMapByIdQueryFn,
    meta: {
      errorMessage: t('maps:edit.error_map_single_fetch'),
      autoClose: false,
      toastId: 'fetchError',
    },
  });
}

function findMapByIdQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof MAP_KEYS)['detail']>>) {
  const { mapId } = queryKey[0];

  return findMapById(mapId);
}

/**
 * Search all maps.
 *
 * @param searchParams the search parameters.
 */
export function useMapsSearch(searchParams: MapSearchParameters) {
  const { t } = useTranslation(['maps']);

  return useInfiniteQuery({
    queryKey: MAP_KEYS.search(searchParams),
    queryFn: searchSeedsQueryFn,
    getNextPageParam: (lastPage) => lastPage.page + 1,
    meta: {
      autoClose: false,
      errorMessage: t('maps:overview.error_map_fetch'),
    },
  });
}

function searchSeedsQueryFn({
  pageParam = 1,
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof MAP_KEYS)['search']>>) {
  const { entity: _, scope: __, ...params } = queryKey[0];

  return findAllMaps(pageParam, params);
}

/**
 * Mutations
 */

/**
 * A mutation to create a new map.
 */
export function useCreateMap() {
  const { t } = useTranslation(['maps']);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMap,
    onSuccess: () => {
      queryClient.invalidateQueries(MAP_KEYS._helpers.all);
    },
    onError: () => {
      errorToastGrouped(t('maps:create.error_map_create'), { autoClose: false });
    },
  });
}

/**
 * A mutation to edit a map.
 */
export function useEditMap() {
  const { t } = useTranslation(['maps']);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMap,
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries(MAP_KEYS.detail(id));
    },
    onError: () => {
      errorToastGrouped(t('maps:edit.error_map_edit'), { autoClose: false });
    },
  });
}
