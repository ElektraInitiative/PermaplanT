import { MapDto, NewMapDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export async function createMap(map: NewMapDto) {
  try {
    await axios.post<MapDto>(`${baseApiUrl}/api/maps`, map);
  } catch (error) {
    throw error as Error;
  }
}
