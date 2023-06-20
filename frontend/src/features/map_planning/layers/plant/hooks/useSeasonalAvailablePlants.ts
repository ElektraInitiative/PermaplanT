import { getSeasonalAvailablePlants } from '../api/getSeasonalAvailablePlants';
import { useQuery } from '@tanstack/react-query';

export function useSeasonalAvailablePlants(mapId: number, date: Date) {
  const { data, isLoading } = useQuery(['plants/suggestions/available'] as const, {
    queryFn: () => getSeasonalAvailablePlants(mapId, date, 0),
  });

  return {
    plants: data?.results ?? [],
    isLoading,
  };
}
