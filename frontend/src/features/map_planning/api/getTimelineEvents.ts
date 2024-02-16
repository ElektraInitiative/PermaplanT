import { TimelineDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function getTimelineEvents(mapId: number) {
  const http = createAPI();

  try {
    const searchParams = new URLSearchParams();
    searchParams.append('start', '2020-01-01');
    searchParams.append('end', '2024-04-01');

    const response = await http.get<TimelineDto>(`/api/maps/${mapId}/timeline?${searchParams}`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
