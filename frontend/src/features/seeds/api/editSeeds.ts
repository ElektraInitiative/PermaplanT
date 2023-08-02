import { NewSeedDto, SeedDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import { createAPI } from '@/config/axios';

export const editSeed = async (seed: NewSeedDto, id: number) => {
  const http = createAPI();
  try {
    await http.put<SeedDto>(`${baseApiUrl}/api/seeds/${id}`, seed);
  } catch (error) {
    throw error as Error;
  }
};
