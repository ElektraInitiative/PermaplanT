import { NewSeedDto, SeedDto } from '@/bindings/definitions';

import axios from 'axios';
import { baseApiUrl } from '@/config';

export const createSeed = async (seed: NewSeedDto) => {
  try {
    await axios.post<SeedDto>(`${baseApiUrl}/api/seeds`, seed);
  } catch (error) {
    throw error as Error;
  }
};
