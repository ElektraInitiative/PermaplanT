import { MapDto, NewMapDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function createMap(map: NewMapDto) {
  const http = createAPI();
  try {
    const response = await http.post<MapDto>('/api/maps', map);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
