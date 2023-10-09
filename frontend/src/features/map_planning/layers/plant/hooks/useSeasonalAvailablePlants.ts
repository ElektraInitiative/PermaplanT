import { getSeasonalAvailablePlants } from '../api/getSeasonalAvailablePlants';
import { Page, PlantsSummaryDto } from '@/bindings/definitions';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export function useSeasonallyAvailablePlants(mapId: number, date: Date) {
  const { t } = useTranslation(['plantingSuggestions']);

  const { data, error } = useQuery(['plants/suggestions/available'] as const, {
    queryFn: () => getSeasonalAvailablePlants(mapId, date, 0),
    keepPreviousData: true,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const clearSearchTerm = useCallback(() => {
    setSearchTerm('');
  }, []);

  if (error) {
    toast.error(t('plantingSuggestions:available_seeds.error_fetching_seasonal_suggestions'), {
      autoClose: false,
    });
  }

  const filteredPlantSeeds = findAvailablePlantSeedsBySearchTerm(data, searchTerm);

  return {
    hasAnyAvailablePlantSeeds: !hasNoSeasonallyAvailablePlantSeeds(data, searchTerm),
    filteredPlantSeeds,
    searchActions: {
      searchAvailablePlantSeeds: setSearchTerm,
      clearSearchTerm,
    },
  };
}

function hasNoSeasonallyAvailablePlantSeeds(
  data: Page<PlantsSummaryDto> | undefined,
  searchTerm: string,
) {
  const existPlantSeeds = () => Boolean(data?.results?.length);

  return searchTerm.length === 0 && !existPlantSeeds();
}

function findAvailablePlantSeedsBySearchTerm(
  data: Page<PlantsSummaryDto> | undefined,
  searchTerm: string,
) {
  const availablePlantSeeds = data?.results;

  if (!availablePlantSeeds) {
    return [];
  }

  if (searchTerm.trim().length === 0) {
    return availablePlantSeeds;
  }

  return filterPlantSeedsBySearchTerm(availablePlantSeeds, searchTerm.toLowerCase());
}

function filterPlantSeedsBySearchTerm(plants: PlantsSummaryDto[], searchTerm: string) {
  const isOccuringInCommonName = (commonName: string[] | undefined) => {
    return commonName?.filter((name) => name.toLowerCase().indexOf(searchTerm) !== -1)?.length;
  };

  const isOccuringInUniqueName = (uniqueName: string) => {
    return uniqueName.toLowerCase().indexOf(searchTerm) !== -1;
  };

  return plants.filter((plant) => {
    return (
      isOccuringInCommonName(plant.common_name_en) || isOccuringInUniqueName(plant.unique_name)
    );
  });
}
