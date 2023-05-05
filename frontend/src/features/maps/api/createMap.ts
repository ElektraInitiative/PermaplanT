import { MapDto, NewMapDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export async function createMap(user_id: number, map: NewMapDto) {
  try {
    const response = await axios.post<MapDto>(`${baseApiUrl}/api/users/${user_id}/maps`, map);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
