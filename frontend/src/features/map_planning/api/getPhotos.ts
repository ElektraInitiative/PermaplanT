import { createAPI } from '@/config/axios';
import { PhotoDto } from '../store/MapStoreTypes';

export async function getPhotos(mapId: number, layerId?: number) {
  if (!layerId) {
    return [];
  }

  const http = createAPI();

  try {
    const response = await http.get<PhotoDto[]>(
      `api/maps/${mapId}/layers/photos?layer_id=${layerId}`,
    );
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
