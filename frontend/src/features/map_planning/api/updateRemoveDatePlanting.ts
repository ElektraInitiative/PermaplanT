import { UpdatePlantingDto, UpdateRemoveDatePlantingDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function updateRemoveDatePlanting(
  mapId: number,
  id: string,
  planting: Pick<UpdateRemoveDatePlantingDto, 'removeDate' | 'actionId'>,
) {
  const http = createAPI();

  const dto: UpdatePlantingDto = {
    type: 'UpdateRemoveDate',
    content: planting,
  };

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/plants/plantings/${id}`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
