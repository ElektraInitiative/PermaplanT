import { ShadingDto, UpdateShadingDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const updateShading = async (
  mapId: number,
  id: string,
  shading: UpdateShadingDto,
): Promise<ShadingDto> => {
  const http = createAPI();

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/shade/shadings/${id}`, shading);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
