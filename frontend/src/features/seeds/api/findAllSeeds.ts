import { Page, SeedDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const findAllSeeds = async (page: number, name?: string): Promise<Page<SeedDto>> => {
  try {
    const pageString: string = page != undefined ? page.toString() : '1';

    const searchParams = new URLSearchParams();
    searchParams.append('per_page', '10');
    searchParams.append('page', pageString);

    if (name) {
      searchParams.append('name', name);
    }

    const response = await axios.get<Page<SeedDto>>(`${baseApiUrl}/api/seeds?${searchParams}`);

    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
