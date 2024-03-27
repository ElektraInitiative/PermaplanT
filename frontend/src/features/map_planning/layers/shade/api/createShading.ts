import { NewShadingDto, ShadingDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function createShading(mapId: number, shading: NewShadingDto): Promise<ShadingDto> {
  const http = createAPI();

  try {
    const response = await http.post<ShadingDto>(
      `api/maps/${mapId}/layers/shade/shadings`,
      shading,
    );
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
