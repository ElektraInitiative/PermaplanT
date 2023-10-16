import { UpdateAddDatePlantingDto, UpdatePlantingDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function updateAddDatePlanting(
  mapId: number,
  id: string,
  planting: Pick<UpdateAddDatePlantingDto, 'addDate' | 'actionId'>,
) {
  const http = createAPI();

  const dto: UpdatePlantingDto = {
    type: 'UpdateAddDate',
    content: planting,
  };

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/plants/plantings/${id}`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
