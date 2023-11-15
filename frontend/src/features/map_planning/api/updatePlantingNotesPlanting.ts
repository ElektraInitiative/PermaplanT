/*import { UpdatePlantingDto, UpdatePlantingNotesPlantingDto, UpdateRemoveDatePlantingDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function UpdatePlantingNotesPlanting(
  mapId: number,
  id: string,
  planting: Pick<UpdatePlantingNotesPlantingDto, 'plantingNotes' | 'actionId'>,
) {
  const http = createAPI();

  const dto: UpdatePlantingDto = {
    type: 'UpdatePlantingNotes',
    content: planting,
  };

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/plants/plantings/${id}`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
*/

export {};
