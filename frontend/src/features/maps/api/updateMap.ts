import { MapDto, UpdateMapDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const updateMap = async (data: { id: number; map: UpdateMapDto }): Promise<MapDto> => {
  const http = createAPI();
  try {
    const response = await http.patch<MapDto>(`/api/maps/${data.id}`, data.map);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
