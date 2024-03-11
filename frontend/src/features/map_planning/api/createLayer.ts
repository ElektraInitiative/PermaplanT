import { LayerType, NewLayerDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function createLayer(mapId: number, type: LayerType, name: string) {
  const http = createAPI();

  const dto: NewLayerDto = {
    map_id: mapId,
    type_: type,
    name: name,
    is_alternative: false,
  };

  try {
    const response = await http.post<NewLayerDto>(`api/maps/${mapId}/layers`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
