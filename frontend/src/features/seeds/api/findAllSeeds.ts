import { SeedDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const findAllSeeds = async (): Promise<SeedDto[]> => {
  try {
    const response = await axios.get<SeedDto[]>(`${baseApiUrl}/api/seeds`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
