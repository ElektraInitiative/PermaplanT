import { Page, PlantsSummaryDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const getSeasonalAvailablePlants = async (
  mapId: number,
  date: Date,
  page?: number,
): Promise<Page<PlantsSummaryDto>> => {
  const http = createAPI();

  const pageString: string = page?.toString() ?? '1';

  const searchParams = new URLSearchParams();
  searchParams.append('suggestion_type', 'available');
  searchParams.append('relative_to_date', date.toJSON().split('T')[0]);

  searchParams.append('per_page', '5');
  searchParams.append('page', pageString);

  try {
    const response = await http.get<Page<PlantsSummaryDto>>(
      `api/maps/${mapId}/layers/plants/suggestions?${searchParams.toString()}`,
    );
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
