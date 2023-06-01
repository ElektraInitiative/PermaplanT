import { PlantLayerObjectDto, UpdatePlantingDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';

export const transformPlanting = async (
  id: string,
  planting: Pick<Required<UpdatePlantingDto>, 'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation'>,
): Promise<PlantLayerObjectDto> => {
  const http = createAPI();

  try {
    const response = await http.patch(`api/plantings/${id}`, planting);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
