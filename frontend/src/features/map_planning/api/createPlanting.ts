import { NewPlantingDto, PlantingDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const createPlanting = async (
  mapId: number,
  planting: NewPlantingDto,
): Promise<PlantingDto> => {
  const http = createAPI();

  try {
    const response = await http.post<PlantingDto>(
      `api/maps/${mapId}/layers/plants/plantings`,
      planting,
    );
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
