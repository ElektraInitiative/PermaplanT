import { PlantsDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const findPlantById = async (id: number): Promise<PlantsDto> => {
  try {
    const response = await axios.get<PlantsDto>(`${baseApiUrl}/api/plants/${id}`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
