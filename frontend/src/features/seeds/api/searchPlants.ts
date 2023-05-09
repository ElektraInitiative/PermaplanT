import { Page, PlantsSummaryDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const searchPlants = async (
  searchTerm: string,
  page: number,
): Promise<Page<PlantsSummaryDto>> => {
  try {
    // A page must always be defined in order for the search to work.
    const pageString: string = page != undefined ? page.toString() : '1';

    const searchParams = new URLSearchParams();
    searchParams.append('name', searchTerm);
    searchParams.append('per_page', '30');
    searchParams.append('page', pageString);

    const response = await axios.get<Page<PlantsSummaryDto>>(
      `${baseApiUrl}/api/plants?${searchParams}`,
    );

    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
