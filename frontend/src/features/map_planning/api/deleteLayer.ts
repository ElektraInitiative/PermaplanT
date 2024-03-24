import { NewLayerDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function deleteLayer(mapId: number, layerId: number) {
  const http = createAPI();

  try {
    const response = await http.delete<NewLayerDto>(`api/maps/${mapId}/layers/${layerId}`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
