import { SeedDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const findSeedById = async (id: number | undefined): Promise<SeedDto> => {
  const http = createAPI();

  if (id === undefined) {
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  try {
    const response = await http.get<SeedDto>(`/api/seeds/${id}`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
