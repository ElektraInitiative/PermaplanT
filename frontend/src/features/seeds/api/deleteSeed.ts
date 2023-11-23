import { createAPI } from '@/config/axios';

export const deleteSeed = async (id: number) => {
  const http = createAPI();

  try {
    return await http.delete(`/api/seeds/${id}`);
  } catch (error) {
    throw error as Error;
  }
};
