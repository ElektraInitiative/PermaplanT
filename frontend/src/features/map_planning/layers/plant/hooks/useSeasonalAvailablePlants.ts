import { getSeasonalAvailablePlants } from '../api/getSeasonalAvailablePlants';
import { errorToastGrouped } from '@/features/toasts/groupedToast';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export function useSeasonalAvailablePlants(mapId: number, date: Date) {
  const { t } = useTranslation(['plantingSuggestions']);
  const { data, isLoading, error } = useQuery(['plants/suggestions/available'] as const, {
    meta: {
      autoClose: false,
      errorMessage: t('plantingSuggestions:available_seeds.error_fetching_seasonal_suggestions'),
    },
    queryFn: () => getSeasonalAvailablePlants(mapId, date, 0),
  });

  if (error) {
    console.error(error);
  }

  return {
    plants: data?.results ?? [],
    isLoading,
  };
}
