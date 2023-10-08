import { PlantsSummaryDto } from '@/bindings/definitions';
import { findPlantById } from '@/features/seeds/api/findPlantById';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export function useFindPlantById(onSuccess?: (plant: PlantsSummaryDto) => void) {
  const { t } = useTranslation(['plantings']);
  const [plantId, setPlantId] = useState<number>(0);
  const { data, error } = useQuery(['plants/plant', plantId] as const, {
    queryFn: (context) => findPlantById(context.queryKey[1]),
    staleTime: Infinity,
    onSuccess,
  });

  if (error) {
    toast.error(t('plantings:error_fetching_plant'), { autoClose: false });
  }

  return {
    plant: data,
    actions: {
      findPlant: setPlantId,
    },
  };
}
