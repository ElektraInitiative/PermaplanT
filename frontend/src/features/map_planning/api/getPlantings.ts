import { PlantingDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';

export async function getPlantings() {
  const http = createAPI();

  try {
    const response = await http.get<PlantingDto[]>(`api/plantings`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
