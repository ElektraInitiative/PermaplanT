import { MapCollaboratorDto, NewMapCollaboratorDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function addCollaborator(mapId: number, dto: NewMapCollaboratorDto) {
  const http = createAPI();
  try {
    const response = await http.post<MapCollaboratorDto>(`/api/maps/${mapId}/collaborators`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
