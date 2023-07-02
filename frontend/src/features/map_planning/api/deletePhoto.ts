import { createAPI } from '@/config/axios';

export const deletePhoto = async (mapId: number, id: string): Promise<boolean> => {
  const http = createAPI();

  try {
    const response = await http.delete(`api/maps/${mapId}/layers/photos/${id}`);
    return Boolean(response.data);
  } catch (error) {
    throw error as Error;
  }
};
