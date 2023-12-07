import { getSeasonalAvailablePlants } from '../api/getSeasonalAvailablePlants';
import { Page } from '@/api_types/definitions';
import { findPlantById } from '@/features/seeds/api/findPlantById';
import { searchPlants } from '@/features/seeds/api/searchPlants';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * A query key factory object.
 * Related keys are grouped together.
 * Read: https://tkdodo.eu/blog/leveraging-the-query-function-context
 */
const PLANT_KEYS = {
  _helpers: {
    all: [{ entity: 'plants' }] as const,
    details: () => [{ ...PLANT_KEYS._helpers.all[0], scope: 'detail' }] as const,
    searches: () => [{ ...PLANT_KEYS._helpers.all[0], scope: 'search' }] as const,
    seasonalAvailable: () =>
      [{ ...PLANT_KEYS._helpers.all[0], scope: 'seasonal_available' }] as const,
  },

  detail: (plantId: number) => [{ ...PLANT_KEYS._helpers.details()[0], plantId }] as const,
  search: (searchTerm: string) => [{ ...PLANT_KEYS._helpers.searches()[0], searchTerm }] as const,
  seasonalAvailable: (mapId: number, date: Date, page: number) =>
    [
      {
        ...PLANT_KEYS._helpers.seasonalAvailable()[0],
        mapId,
        date,
        page,
      },
    ] as const,
};

/**
 * Load a plant from the backend using its id.
 */
export function useFindPlantById({ plantId, enabled = true }: FindPlantByIdArgs) {
  const { t } = useTranslation(['plantings']);

  return useQuery({
    queryKey: PLANT_KEYS.detail(plantId),
    queryFn: findPlantByIdQueryFn,
    meta: {
      autoClose: false,
      errorMessage: t('plantings:error_fetching_plant'),
    },
    enabled,
    staleTime: Infinity,
  });
}

type FindPlantByIdArgs = {
  plantId: number;
  enabled?: boolean;
};

function findPlantByIdQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof PLANT_KEYS)['detail']>>) {
  const { plantId } = queryKey[0];

  return findPlantById(plantId);
}

/**
 * A hook that returns some functions to search for plants.
 */
export function usePlantSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
  const { t } = useTranslation(['plantSearch']);

  const queryInfo = useQuery({
    queryKey: PLANT_KEYS.search(debouncedSearchTerm),
    queryFn: searchPlantsQueryFn,
    select: mapPageToList,
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
    queryInfo,
    actions: {
      searchPlants: setSearchTerm,
      clearSearchTerm,
    },
  };
}

function mapPageToList<T>(data: Page<T>) {
  return data.results;
}

function searchPlantsQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof PLANT_KEYS)['search']>>) {
  const { searchTerm } = queryKey[0];

  return searchPlants(searchTerm, 0);
}
/**
 * A hook to fetch plants that are available in the current season.
 */
export function useSeasonalAvailablePlants(mapId: number, date: Date) {
  const { t } = useTranslation(['plantingSuggestions']);

  return useQuery({
    queryKey: PLANT_KEYS.seasonalAvailable(mapId, date, 0),
    queryFn: seasonalAvailablePlants,
    select: mapPageToList,
    meta: {
      autoClose: false,
      errorMessage: t('plantingSuggestions:available_seeds.error_fetching_seasonal_suggestions'),
    },
  });
}

function seasonalAvailablePlants({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof PLANT_KEYS)['seasonalAvailable']>>) {
  const { mapId, date, page } = queryKey[0];
  return getSeasonalAvailablePlants(mapId, date, page);
}
