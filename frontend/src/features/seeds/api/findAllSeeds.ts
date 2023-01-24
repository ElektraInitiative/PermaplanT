import { ResponseBody, SeedDTO } from '@/bindings/definitions';

import axios from 'axios';
import { baseApiUrl } from '@/config';

export const findAllSeeds = async (): Promise<SeedDTO[]> => {
  try {
    const response = await axios.get<ResponseBody<SeedDTO[]>>(`${baseApiUrl}/api/seeds`);
    return response.data.data;
  } catch (error) {
    throw error as Error;
  }
};
