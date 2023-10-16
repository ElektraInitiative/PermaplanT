import { MapDto, UpdateMapDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const updateMap = async (updateObject: UpdateMapDto, mapId: number): Promise<MapDto> => {
  const http = createAPI();
  try {
    const response = await http.patch<MapDto>(`/api/maps/${mapId}`, updateObject);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
