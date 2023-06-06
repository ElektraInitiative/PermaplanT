import { createAPI } from '@/config/axios';

export const deletePlanting = async (mapId: number, id: string): Promise<boolean> => {
  const http = createAPI();

  try {
    const response = await http.delete(`api/maps/${mapId}/layers/plants/plantings/${id}`);
    return Boolean(response.data);
  } catch (error) {
    throw error as Error;
  }
};
