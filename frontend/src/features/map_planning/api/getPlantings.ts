import { PlantingDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';

export async function getPlantings(mapId: string) {
  const http = createAPI();

  try {
    const response = await http.get<PlantingDto[]>(`api/maps/${mapId}/layers/plants/plantings`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
