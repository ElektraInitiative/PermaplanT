import { PlantsSummaryDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export interface SearchResult {
  dtos: PlantsSummaryDto[],
  hasMore: boolean,
}

export const searchPlants = async (searchTerm: string, page: number): Promise<SearchResult> => {
  try {
    // A page must always be defined in order for the search to work.
    const pageString: string = page != undefined ? page.toString() : '1';

    const searchParams = new URLSearchParams();
    searchParams.append('search_term', searchTerm);
    searchParams.append('limit', '10');
    searchParams.append('page', pageString);

    const response = await axios.get<PlantsSummaryDto[]>(
      `${baseApiUrl}/api/plants?${searchParams}`,
    );
    
    return {
      dtos: response.data,
      // If a page could not be filled completely, there will propably be no more data.
      hasMore: response.data.length == 10,
    };
  } catch (error) {
    throw error as Error;
  }
};
