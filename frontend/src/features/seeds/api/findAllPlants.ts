import { PlantsSummaryDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const findAllPlants = async (): Promise<PlantsSummaryDto[]> => {
  const http = createAPI();
  try {
    const response = await http.get<PlantsSummaryDto[]>(`/api/plants`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
