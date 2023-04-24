import { NewSeedDto, SeedDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const editSeed = async (seed: NewSeedDto, id: number) => {
  try {
    await axios.put<SeedDto>(`${baseApiUrl}/api/seeds/${id}`, seed);
  } catch (error) {
    throw error as Error;
  }
};
