import { getSeasonalAvailablePlants } from '../api/getSeasonalAvailablePlants';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export function useSeasonalAvailablePlants(mapId: number, date: Date) {
  const { data, isLoading, error } = useQuery(['plants/suggestions/available'] as const, {
    queryFn: () => getSeasonalAvailablePlants(mapId, date, 0),
  });

  if (error) {
    console.error(error);
    toast.error('', { autoClose: false });
  }

  return {
    plants: data?.results ?? [],
    isLoading,
  };
}
