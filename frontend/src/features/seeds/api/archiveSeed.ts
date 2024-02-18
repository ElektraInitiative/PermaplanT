import { ArchiveSeedDto, SeedDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const archiveSeed = async (id: number, archive: ArchiveSeedDto) => {
  const http = createAPI();

  try {
    const response = await http.patch<SeedDto>(`/api/seeds/${id}/archive`, archive);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
