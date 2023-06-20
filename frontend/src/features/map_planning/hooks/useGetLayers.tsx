import { getLayers } from '../api/getLayers';
import { useQuery } from '@tanstack/react-query';

/**
 * Gets all layers for the given map id.
 * Re-fetches data only after a certain amount of time to reduce network stress.
 */
export function useGetLayers(mapId: number) {
  const data = useQuery(['layers', mapId] as const, {
    queryFn: ({ queryKey: [, mapId] }) => getLayers(mapId),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return data;
}
