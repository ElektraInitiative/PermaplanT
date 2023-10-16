import { BaseLayerImageDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function getBaseLayerImage(mapId: number, layerId?: number) {
  if (!layerId) {
    return null;
  }

  const http = createAPI();

  try {
    const response = await http.get<BaseLayerImageDto[]>(
      `api/maps/${mapId}/layers/base/${layerId}/images/`,
    );
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    throw error as Error;
  }
}
