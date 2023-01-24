import { NewSeedDTO } from '@/bindings/definitions';
import axios from 'axios';
import { baseApiUrl } from '@/config';

export const createSeed = async (seed: NewSeedDTO) => {
  try {
    await axios.post(`${baseApiUrl}/api/seeds`, seed);
  } catch (error) {
    throw error as Error;
  }
};
