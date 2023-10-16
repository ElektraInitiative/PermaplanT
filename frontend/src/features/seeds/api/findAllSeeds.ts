import { Page, SeedDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const findAllSeeds = async (page: number, name?: string): Promise<Page<SeedDto>> => {
  const http = createAPI();
  try {
    const pageString: string = page != undefined ? page.toString() : '1';

    const searchParams = new URLSearchParams();
    searchParams.append('per_page', '30');
    searchParams.append('page', pageString);

    if (name) {
      searchParams.append('name', name);
    }

    const response = await http.get<Page<SeedDto>>(`/api/seeds?${searchParams}`);

    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
