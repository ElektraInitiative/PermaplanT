import { PlantsSearchDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const searchPlants = async (searchTerm: string): Promise<PlantsSearchDto[]> => {
  try {
    const url = new URL(`${baseApiUrl}/api/plants/search`);
    url.searchParams.append('search_term', searchTerm);
    url.searchParams.append('limit', '10');

    const response = await axios.get<PlantsSearchDto[]>(url.toString());
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
