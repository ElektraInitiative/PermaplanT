import { MapCollaboratorDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function findCollaborators(mapId: number): Promise<MapCollaboratorDto[]> {
  const http = createAPI();
  try {
    const result = await http.get(`/api/maps/${mapId}/collaborators`);
    return result.data;
  } catch (error) {
    throw error as Error;
  }
}
