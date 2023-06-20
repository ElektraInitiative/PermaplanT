import { getLayers } from '../api/getLayers';
import { useQuery } from '@tanstack/react-query';

export function useGetLayers(mapId: string) {
  const data = useQuery(['layers', mapId] as const, {
    queryFn: ({ queryKey: [, mapId] }) => getLayers(mapId),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return data;
}
