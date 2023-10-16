import { SeedDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const findSeedById = async (id: number): Promise<SeedDto> => {
  const http = createAPI();
  try {
    const response = await http.get<SeedDto>(`/api/seeds/${id}`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
