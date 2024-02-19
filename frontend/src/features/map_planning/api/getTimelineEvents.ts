import { TimelineDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function getTimelineEvents(mapId: number, startDate: string, endDate: string) {
  const http = createAPI();

  try {
    const searchParams = new URLSearchParams();
    searchParams.append('start', startDate);
    searchParams.append('end', endDate);

    const response = await http.get<TimelineDto>(`/api/maps/${mapId}/timeline?${searchParams}`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
