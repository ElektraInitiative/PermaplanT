import { PlantingDto, UpdatePlantingDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';

export const movePlanting = async (
  mapId: number,
  id: string,
  planting: Required<Pick<UpdatePlantingDto, 'map_id' | 'x' | 'y'>>,
): Promise<PlantingDto> => {
  const http = createAPI();

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/plants/plantings/${id}`, planting);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
