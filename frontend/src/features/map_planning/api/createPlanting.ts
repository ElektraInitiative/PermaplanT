import { NewPlantingDto, PlantLayerObjectDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';

export const createPlanting = async (planting: NewPlantingDto): Promise<PlantLayerObjectDto> => {
  const http = createAPI();

  try {
    const response = await http.post<PlantLayerObjectDto>('api/plantings', planting);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
