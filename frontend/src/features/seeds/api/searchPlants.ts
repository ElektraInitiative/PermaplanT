import { PlantsSummaryDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const searchPlants = async (searchTerm: string, page: number): Promise<PlantsSummaryDto[]> => {
  try {
    // A page must always be defined in order for the search to work.
    const pageString: string = page != undefined ? page.toString() : "1";

    const url = new URL(`${baseApiUrl}/api/plants`);
    url.searchParams.append('search_term', searchTerm);
    url.searchParams.append('limit', '10');
    url.searchParams.append('page', pageString);

    const response = await axios.get<PlantsSummaryDto[]>(url.toString());
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
