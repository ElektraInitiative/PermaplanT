import { NewPlantingDto, PlantingDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';

export const createPlanting = async (planting: NewPlantingDto): Promise<PlantingDto> => {
  const http = createAPI();

  try {
    const response = await http.post<PlantingDto>('api/plantings', planting);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
