import { GuidedToursDto, UpdateGuidedToursDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';

export async function updateTourStatus(status_update: UpdateGuidedToursDto) {
  const http = createAPI();

  try {
    const response = await http.patch<GuidedToursDto>('api/tours', status_update);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
