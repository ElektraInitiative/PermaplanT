import { MapDto, Page } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const findAllMaps = async (
  user_id: number,
  page: number,
  is_inactive?: boolean,
): Promise<Page<MapDto>> => {
  const pageString: string = page !== undefined ? page.toString() : '1';
  const searchParams = new URLSearchParams();

  if (is_inactive) {
    searchParams.append('is_inactive', 'true');
  }
  searchParams.append('per_page', '30');
  searchParams.append('page', pageString);

  try {
    const response = await axios.get<Page<MapDto>>(
      `${baseApiUrl}/api/users/${user_id}/maps?${searchParams}`,
    );
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
