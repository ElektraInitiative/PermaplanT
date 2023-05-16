import { ConfigDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const getAuthInfo = async (): Promise<ConfigDto> => {
  try {
    const response = await axios.get<ConfigDto>(`${baseApiUrl}/api/config`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
