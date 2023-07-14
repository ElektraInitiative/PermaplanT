import { findPlantById } from '@/features/seeds/api/findPlantById';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export function useFindPlantById(plantId: number, enabled = true) {
  const { t } = useTranslation(['plantEdit']);
  const { data, error } = useQuery(['plants/plant', plantId] as const, {
    queryFn: (context) => findPlantById(context.queryKey[1]),
    enabled,
    staleTime: Infinity,
  });

  if (error) {
    toast.error(t('plantEdit:error_fetching_plant'), { autoClose: false });
  }

  return {
    plant: data,
  };
}
