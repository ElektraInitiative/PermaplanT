import { PlantsSearchDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const searchPlants = async (searchTerm: string, page: number): Promise<PlantsSearchDto> => {
  try {
    // A page must always be defined in order for the search to work.
    const pageString: string = page != undefined ? page.toString() : '1';

    const searchParams = new URLSearchParams();
    searchParams.append('search_term', searchTerm);
    searchParams.append('limit', '10');
    searchParams.append('page', pageString);
    // TODO: change according to language settings
    searchParams.append('preferred_language', 'english')

    const response = await axios.get<PlantsSearchDto>(`${baseApiUrl}/api/plants?${searchParams}`);

    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
