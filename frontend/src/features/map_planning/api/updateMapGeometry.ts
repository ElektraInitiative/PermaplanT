import { MapDto, UpdateMapGeometryDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function updateMapGeometry(dto: UpdateMapGeometryDto, mapId: number) {
  const http = createAPI();

  try {
    const response = await http.patch<MapDto>(`api/maps/${mapId}/geometry`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
