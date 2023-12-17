import { ArchiveSeedDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export const archiveSeed = async (id: number, archive: ArchiveSeedDto) => {
  const http = createAPI();

  try {
    return await http.patch(`/api/seeds/${id}/archive`, archive);
  } catch (error) {
    throw error as Error;
  }
};
