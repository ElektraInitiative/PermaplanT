import { baseApiUrl } from '@/config';
import { createAPI } from '@/config/axios';

export const deleteSeed = async (id: number) => {
  const http = createAPI();

  try {
    await http.delete(`${baseApiUrl}/api/seeds/${id}`);
  } catch (error) {
    throw error as Error;
  }
};
