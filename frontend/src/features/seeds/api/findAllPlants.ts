import { PlantsDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const findAllPlants = async (): Promise<PlantsDto[]> => {
  try {
    const response = await axios.get<PlantsDto[]>(`${baseApiUrl}/api/plants`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
