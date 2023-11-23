import { GuidedToursDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function getTourStatus() {
  const http = createAPI();

  try {
    const response = await http.get<GuidedToursDto>('api/tours');
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
