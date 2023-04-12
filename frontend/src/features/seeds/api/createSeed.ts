import { NewSeedDto, SeedDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const createSeed = async (seed: NewSeedDto) => {
  try {
    await axios.post<SeedDto>(`${baseApiUrl}/api/seeds`, seed);
  } catch (error) {
    throw error as Error;
  }
};
