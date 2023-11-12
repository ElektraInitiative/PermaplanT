import { SeedDto } from '@/api_types/definitions';
import { PlantForPlanting } from '@/features/map_planning/store/MapStoreTypes';
import { findPlantById } from '@/features/seeds/api/findPlantById';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Request plants from the backend using a seed and handle them using a callback.
 *
 * @param afterPlantLoad This function will be called once a new plant is loaded.
 * @returns A function that takes a plant id and triggers a plant load.
 */
export function useFindPlantFromSeedCallback(afterPlantLoad: (plant: PlantForPlanting) => void) {
  const { t } = useTranslation(['plantings']);
  const [plantId, setPlantId] = useState(0);
  const [seed, setSeed] = useState<SeedDto | null>(null);
  const { data: plant } = useQuery(['plants/plant', plantId] as const, {
    queryFn: (context) => findPlantById(context.queryKey[1]),
    meta: {
      autoClose: false,
      errorMessage: plantId !== 0 ? t('plantings:error_fetching_plant') : undefined,
    }
  });

  // useQuery's onSuccess is deprecated and does not seem to work in this context
  // for whatever reason.
  useEffect(() => {
    if (plant) afterPlantLoad({ plant, seed });
  }, [plant]); // eslint-disable-line react-hooks/exhaustive-deps

  return (seed: SeedDto) => {
    // useQuery will not return any data if th plant_id is undefined.
    setPlantId(seed.plant_id ?? -1);
    setSeed(seed);
  };
}
