import { SeedDto } from '@/bindings/definitions';

import axios from 'axios';
import { baseApiUrl } from '@/config';

export const findAllSeeds = async (): Promise<SeedDto[]> => {
  try {
    const response = await axios.get<SeedDto[]>(`${baseApiUrl}/api/seeds`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
