import { MovePlantingDto, PlantingDto, UpdatePlantingDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const movePlanting = async (
  mapId: number,
  id: string,
  planting: Required<Pick<MovePlantingDto, 'x' | 'y' | 'actionId'>>,
): Promise<PlantingDto> => {
  const http = createAPI();

  const dto: UpdatePlantingDto = {
    type: 'Move',
    content: planting,
  };

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/plants/plantings/${id}`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
