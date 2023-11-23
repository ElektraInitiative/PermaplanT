import { MapDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function getMap(mapId: number) {
  const http = createAPI();

  try {
    const response = await http.get<MapDto>(`api/maps/${mapId}`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
