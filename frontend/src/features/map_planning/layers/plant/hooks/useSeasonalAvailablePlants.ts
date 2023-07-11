import { getSeasonalAvailablePlants } from '../api/getSeasonalAvailablePlants';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export function useSeasonalAvailablePlants(mapId: number, date: Date) {
  const { t } = useTranslation(['plantingSuggestions']);
  const { data, isLoading, error } = useQuery(['plants/suggestions/available'] as const, {
    queryFn: () => getSeasonalAvailablePlants(mapId, date, 0),
  });

  if (error) {
    console.error(error);
    toast.error(t('plantingSuggestions:available_seeds.error_fetching_seasonal_suggestions'), {
      autoClose: false,
    });
  }

  return {
    plants: data?.results ?? [],
    isLoading,
  };
}
