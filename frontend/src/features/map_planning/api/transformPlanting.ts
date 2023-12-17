import { PlantingDto, TransformPlantingDto, UpdatePlantingDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const transformPlanting = async (
  mapId: number,
  id: string,
  planting: Required<
    Pick<TransformPlantingDto, 'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation' | 'actionId'>
  >,
): Promise<PlantingDto> => {
  const http = createAPI();

  const dto: UpdatePlantingDto = {
    type: 'Transform',
    content: planting,
  };

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/plants/plantings/${id}`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
