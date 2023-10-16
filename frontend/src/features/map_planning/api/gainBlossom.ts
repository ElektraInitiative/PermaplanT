import { GainedBlossomsDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function gainBlossom(gained_blossom: GainedBlossomsDto) {
  const http = createAPI();

  try {
    const response = await http.post<GainedBlossomsDto>('api/blossoms', gained_blossom);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
