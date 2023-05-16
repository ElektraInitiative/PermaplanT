import { ConfigDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios/index';

export const getAuthInfo = async (): Promise<ConfigDto> => {
  const http = createAPI();
  try {
    const response = await http.get<ConfigDto>('/api/config');
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
