import { NewSeedDto, SeedDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const createSeed = async (seed: NewSeedDto) => {
  const http = createAPI();
  try {
    const response = await http.post<SeedDto>('/api/seeds', seed);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
