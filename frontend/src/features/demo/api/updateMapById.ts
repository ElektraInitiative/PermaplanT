import { Body, NewMapDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const updateMapById = async (id: string, map: NewMapDto) => {
  try {
    await axios.post<Body<NewMapDto>>(`${baseApiUrl}/api/maps/${id}`, map);
  } catch (error) {
    throw error as Error;
  }
};
