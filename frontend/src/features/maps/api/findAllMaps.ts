import { MapDto, MapSearchParameters, Page } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const findAllMaps = async (
  page: number,
  mapSearchParameters?: MapSearchParameters,
): Promise<Page<MapDto>> => {
  const http = createAPI();
  const pageString: string = page !== undefined ? page.toString() : '1';
  const searchParams = new URLSearchParams();

  if (mapSearchParameters) {
    if (mapSearchParameters.is_inactive) {
      searchParams.append('is_inactive', 'true');
    }
    if (mapSearchParameters.name) {
      searchParams.append('name', mapSearchParameters.name);
    }
    if (mapSearchParameters.owner_id) {
      searchParams.append('owner_id', mapSearchParameters.owner_id);
    }
    if (mapSearchParameters.privacy) {
      searchParams.append('privacy', mapSearchParameters.privacy);
    }
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
