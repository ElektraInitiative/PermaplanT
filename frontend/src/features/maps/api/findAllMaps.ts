import { MapDto, Page } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';

export const findAllMaps = async (page: number, is_inactive?: boolean): Promise<Page<MapDto>> => {
  const http = createAPI();
  const pageString: string = page !== undefined ? page.toString() : '1';
  const searchParams = new URLSearchParams();

  if (is_inactive) {
    searchParams.append('is_inactive', 'true');
  }
  searchParams.append('per_page', '30');
  searchParams.append('page', pageString);

  try {
    const response = await http.get<Page<MapDto>>(`/api/maps?${searchParams}`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
