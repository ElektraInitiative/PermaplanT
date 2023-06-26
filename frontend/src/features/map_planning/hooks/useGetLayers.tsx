import { getLayers } from '../api/getLayers';
import { useQuery } from '@tanstack/react-query';

const TEN_MINUTES = 1000 * 60 * 10;

/**
 * Gets all layers for the given map id.
 * Re-fetches data only after a certain amount of time to reduce network stress.
 */
export function useGetLayers(mapId: number) {
  const data = useQuery(['layers', mapId], {
    queryFn: () => getLayers(mapId),
    staleTime: TEN_MINUTES,
  });

  return data;
}
