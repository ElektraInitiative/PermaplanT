import { createAPI } from '@/config/axios';

export const deletePlanting = async (id: string): Promise<boolean> => {
  const http = createAPI();

  try {
    const response = await http.delete(`api/plantings/${id}`);
    return Boolean(response.data);
  } catch (error) {
    throw error as Error;
  }
};
