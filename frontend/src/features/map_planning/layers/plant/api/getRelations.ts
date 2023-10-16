import { RelationsDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function getRelations(mapId: number, plantId: number): Promise<RelationsDto> {
  const http = createAPI();

  const searchParams = new URLSearchParams();
  searchParams.append('plant_id', plantId.toString());

  try {
    const response = await http.get<RelationsDto>(
      `api/maps/${mapId}/layers/plants/relations?${searchParams.toString()}`,
    );
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
