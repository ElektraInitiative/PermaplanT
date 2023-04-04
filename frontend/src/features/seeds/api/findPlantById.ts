import { PlantsSummaryDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const findPlantById = async (id: number): Promise<PlantsSummaryDto> => {
  try {
    const response = await axios.get<PlantsSummaryDto>(`${baseApiUrl}/api/plants/${id}`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
