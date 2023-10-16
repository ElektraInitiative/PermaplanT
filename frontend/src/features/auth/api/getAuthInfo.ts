import { ConfigDto } from '@/api_types/definitions';
import { createUnauthorizedAPI } from '@/config/axios';

export const getAuthInfo = async (): Promise<ConfigDto> => {
  try {
    const http = createUnauthorizedAPI();
    const response = await http.get<ConfigDto>('api/config');
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
