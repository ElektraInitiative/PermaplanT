import { NewSeedDTO, SeedDTO } from '@/bindings/definitions';

import { ResponseBody } from '../../../bindings/definitions';
import axios from 'axios';
import { baseApiUrl } from '@/config';

export const createSeed = async (seed: NewSeedDTO) => {
  try {
    await axios.post<ResponseBody<SeedDTO>>(`${baseApiUrl}/api/seeds`, seed);
  } catch (error) {
    throw error as Error;
  }
};
