import { ResponseBody, PlantsDTO } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const findAllPlants = async (): Promise<PlantsDTO[]> => {
  try {
    const response = await axios.get<ResponseBody<PlantsDTO[]>>(`${baseApiUrl}/api/plants`);
    return response.data.data;
  } catch (error) {
    throw error as Error;
  }
};
