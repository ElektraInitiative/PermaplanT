import { SeedDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const findSeedById = async (id: number): Promise<SeedDto> => {
  try {
    const response = await axios.get<SeedDto>(`${baseApiUrl}/api/seeds/${id}`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
