import { findPlantById } from '@/features/seeds/api/findPlantById';
import { useQuery } from '@tanstack/react-query';

export function useFindPlantById(plantId: number, enabled = true) {
  const { data } = useQuery(['plants/plant', plantId] as const, {
    queryFn: (context) => findPlantById(context.queryKey[1]),
    enabled,
    staleTime: Infinity,
  });

  return {
    plant: data,
  };
}
