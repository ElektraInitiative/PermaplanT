import { PlantsSummaryDto } from '@/api_types/definitions';
import { findPlantById } from '@/features/seeds/api/findPlantById';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

/**
 * Request plants from the backend and handle them using a callback.
 *
 * @param afterPlantLoad This function will be called once a new plant is loaded.
 * @returns A function that takes a plant id and triggers a plant load.
 */
export function useFindPlantCallback(afterPlantLoad: (plant: PlantsSummaryDto) => void) {
  const { t } = useTranslation(['plantings']);
  const [plantId, setPlantId] = useState(0);
  const { data, error } = useQuery(['plants/plant', plantId] as const, {
    queryFn: (context) => findPlantById(context.queryKey[1]),
    staleTime: Infinity,
  });

  // useQuery's onSuccess is deprecated and does not seem to work in this context
  // for whatever reason.
  useEffect(() => {
    if (data) afterPlantLoad(data);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error && plantId !== 0) {
    toast.error(t('plantings:error_fetching_plant'), { autoClose: false });
  }

  return setPlantId;
}
