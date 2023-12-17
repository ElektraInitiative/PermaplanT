import { Page, PlantsSummaryDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const searchPlants = async (
  searchTerm: string,
  page: number,
): Promise<Page<PlantsSummaryDto>> => {
  const http = createAPI();
  try {
    // A page must always be defined in order for the search to work.
    const pageString: string = page != undefined ? page.toString() : '1';

    const searchParams = new URLSearchParams();
    searchParams.append('name', searchTerm);
    searchParams.append('per_page', '30');
    searchParams.append('page', pageString);

    const response = await http.get<Page<PlantsSummaryDto>>(`/api/plants?${searchParams}`);

    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
