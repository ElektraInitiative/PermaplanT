import { NewSeedDto, SeedDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';

// variables need to be submitted as an object so that they are compatible with useMutation
export const editSeed = async (data: { seed: NewSeedDto; id: number }) => {
  const http = createAPI();
  try {
    await http.put<SeedDto>(`/api/seeds/${data.id}`, data.seed);
  } catch (error) {
    throw error as Error;
  }
};
