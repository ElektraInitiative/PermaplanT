import { NewSeedDto, SeedDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const createSeed = async (seed: NewSeedDto) => {
  const http = createAPI();
  try {
    return await http.post<SeedDto>('/api/seeds', seed);
  } catch (error) {
    throw error as Error;
  }
};
