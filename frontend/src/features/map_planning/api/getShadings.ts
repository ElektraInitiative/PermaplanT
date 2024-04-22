import { ShadingDto, TimelinePage } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function getShadings(
  mapId: number,
  searchParams: {
    layer_id: number;
    relative_to_date: string;
  },
) {
  const http = createAPI();

  const params = new URLSearchParams({
    layer_id: searchParams.layer_id.toString(),
    relative_to_date: searchParams.relative_to_date,
  });

  try {
    const response = await http.get<TimelinePage<ShadingDto>>(
      `api/maps/${mapId}/layers/shade/shadings?${params}`,
    );
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
