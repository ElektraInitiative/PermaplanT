import { findPlantById } from '@/features/seeds/api/findPlantById';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export function useFindPlantById(plantId: number, enabled = true) {
  const { data, error } = useQuery(['plants/plant', plantId] as const, {
    queryFn: (context) => findPlantById(context.queryKey[1]),
    enabled,
    staleTime: Infinity,
  });

  if (error) {
    toast.error('', { autoClose: false });
  }

  return {
    plant: data,
  };
}
