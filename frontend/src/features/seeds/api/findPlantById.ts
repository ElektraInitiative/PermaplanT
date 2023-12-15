import { PlantsSummaryDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const findPlantById = async (id: number | undefined): Promise<PlantsSummaryDto> => {
  const http = createAPI();

  if (id === undefined) {
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  try {
    const response = await http.get<PlantsSummaryDto>(`/api/plants/${id}`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
