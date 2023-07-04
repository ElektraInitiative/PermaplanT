import { createAPI } from '@/config/axios';

//TODO: remove when implemented in backend
export type BaseLayerDto = {
  rotation: number,
  scale: number,
  nextcloudImagePath: string
}
export async function getBaseLayer(mapId: number, layerId?: number) {
  if (!layerId) {
    return null;
  }

  const http = createAPI();

  try {
    const response = await http.get<BaseLayerDto>(
      `api/maps/${mapId}/layers/base?layer_id=${layerId}`,
    );
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
