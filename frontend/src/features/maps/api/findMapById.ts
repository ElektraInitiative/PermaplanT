import { MapDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const findMapById = async (mapId: number): Promise<MapDto> => {
  const http = createAPI();
  try {
    const result = await http.get(`/api/maps/${mapId}`);
    return result.data;
  } catch (error) {
    throw error as Error;
  }
};
