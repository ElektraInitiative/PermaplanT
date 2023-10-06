import { GuidedToursDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function createTourStatus() {
  const http = createAPI();

  try {
    const response = await http.post<GuidedToursDto>('api/tours');
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
