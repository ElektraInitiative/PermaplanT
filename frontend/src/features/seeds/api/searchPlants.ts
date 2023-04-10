import { PlantsSummaryDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const searchPlants = async (searchTerm: string): Promise<PlantsSummaryDto[]> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('search_term', searchTerm);
    searchParams.append('limit', '10');

    const response = await axios.get<PlantsSummaryDto[]>(
      `${baseApiUrl}/api/plants?${searchParams}`,
    );
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
