import { PlantingDto, PlantingSearchParameters } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';

export async function getPlantings(mapId: number, searchParams: PlantingSearchParameters) {
  if (!searchParams.layer_id) {
    return [];
  }
  const http = createAPI();

  const params = new URLSearchParams({
    layer_id: searchParams.layer_id.toString(),
    relative_to_date: searchParams.relative_to_date?.toString() || '',
  });

  try {
    const response = await http.get<PlantingDto[]>(
      `api/maps/${mapId}/layers/plants/plantings?${params}`,
    );
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
