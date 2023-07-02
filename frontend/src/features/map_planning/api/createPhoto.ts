import { createAPI } from '@/config/axios';
import { PhotoDto } from '../store/MapStoreTypes';

export const createPhoto = async (
  mapId: number,
  photo: PhotoDto,
): Promise<PhotoDto> => {
  const http = createAPI();

  try {
    const response = await http.post<PhotoDto>(
      `api/maps/${mapId}/layers/photos`,
      photo,
    );
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
