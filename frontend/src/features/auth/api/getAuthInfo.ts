import { baseApiUrl } from '@/config';
import axios from 'axios';

interface AuthInfoDto {
  issuer_uri: string;
  client_id: string;
}

export const getAuthInfo = async (): Promise<AuthInfoDto> => {
  try {
    const response = await axios.get<AuthInfoDto>(`${baseApiUrl}/api/config`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
