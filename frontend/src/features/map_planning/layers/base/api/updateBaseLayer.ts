import { createAPI } from '@/config/axios';
import { UpdateBaseLayerDto } from '../actions';

export const updateBaseLayer = async (
  mapId: number,
  data: Required<UpdateBaseLayerDto>,
): Promise<UpdateBaseLayerDto> => {
  const http = createAPI();

  const dto: UpdateBaseLayerDto = data

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/base/images`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
