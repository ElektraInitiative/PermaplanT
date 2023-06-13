import { PlantingDto, TransformPlantingDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';

export const transformPlanting = async (
  mapId: number,
  id: string,
  planting: Required<Pick<TransformPlantingDto, 'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation'>>,
): Promise<PlantingDto> => {
  const http = createAPI();

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/plants/plantings/${id}`, planting);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
