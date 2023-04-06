import { PlantsSummaryDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const findAllPlants = async (): Promise<PlantsSummaryDto[]> => {
  try {
    const response = await axios.get<PlantsSummaryDto[]>(`${baseApiUrl}/api/plants`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
