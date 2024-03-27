import { NewSeedDto, SeedDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

// variables need to be submitted as an object so that they are compatible with useMutation
export const editSeed = async (data: { seed: NewSeedDto; id: number }) => {
  const http = createAPI();
  try {
    const response = await http.put<SeedDto>(`/api/seeds/${data.id}`, data.seed);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
