import { UpdateBaseLayerImageDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';

export const updateBaseLayer = async (
  id: string,
  mapId: number,
  data: Required<UpdateBaseLayerImageDto>,
): Promise<UpdateBaseLayerImageDto> => {
  const http = createAPI();

  const dto: UpdateBaseLayerImageDto = data
  console.log(id)
  console.log(dto)

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/base/images/${id}`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
