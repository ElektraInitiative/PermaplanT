import { LayerDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function getLayers(mapId: number) {
  const http = createAPI();

  try {
    const response = await http.get<LayerDto[]>(`api/maps/${mapId}/layers`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
