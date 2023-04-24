import { baseApiUrl } from '@/config';
import axios from 'axios';

export const deleteSeed = async (id: number) => {
  try {
    await axios.delete(`${baseApiUrl}/api/seeds/${id}`);
  } catch (error) {
    throw error as Error;
  }
};
