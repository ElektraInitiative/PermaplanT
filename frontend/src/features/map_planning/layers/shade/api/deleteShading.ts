import { DeleteShadingDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const deleteShading = async (
  mapId: number,
  id: string,
  shading: Required<Pick<DeleteShadingDto, 'actionId'>>,
): Promise<boolean> => {
  const http = createAPI();

  try {
    const response = await http.delete(`api/maps/${mapId}/layers/shade/shadings/${id}`, {
      data: shading,
    });
    return Boolean(response.data);
  } catch (error) {
    throw error as Error;
  }
};
