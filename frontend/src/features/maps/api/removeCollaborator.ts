import { DeleteMapCollaboratorDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function removeCollaborator(mapId: number, dto: DeleteMapCollaboratorDto) {
  const http = createAPI();
  try {
    const response = await http.delete(`/api/maps/${mapId}/collaborators`, {
      data: dto,
    });
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
