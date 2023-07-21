import { BlossomsGainedDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';

export async function gainBlossom(gained_blossom: BlossomsGainedDto) {
  const http = createAPI();

  try {
    const response = await http.post<BlossomsGainedDto>('api/blossoms', gained_blossom);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
