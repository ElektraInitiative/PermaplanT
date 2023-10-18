import { findPlantById } from '@/features/seeds/api/findPlantById';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

/**
 * Load a plant from the backend using its id.
 *
 * @param plantId the id of the requested plant.
 * @param enabled will disable the backend query if set to false.
 */
export function useFindPlantById(plantId: number, enabled = true) {
  const { t } = useTranslation(['plantings']);
  const { data, error } = useQuery(['plants/plant', plantId] as const, {
    queryFn: (context) => findPlantById(context.queryKey[1]),
    enabled,
    staleTime: Infinity,
  });

  if (error) {
    toast.error(t('plantings:error_fetching_plant'), { autoClose: false });
  }

  return {
    plant: data,
  };
}
