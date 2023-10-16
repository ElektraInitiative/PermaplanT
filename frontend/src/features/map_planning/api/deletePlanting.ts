import { DeletePlantingDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const deletePlanting = async (
  mapId: number,
  id: string,
  planting: Required<Pick<DeletePlantingDto, 'actionId'>>,
): Promise<boolean> => {
  const http = createAPI();

  try {
    const response = await http.delete(`api/maps/${mapId}/layers/plants/plantings/${id}`, {
      data: planting,
    });
    return Boolean(response.data);
  } catch (error) {
    throw error as Error;
  }
};
