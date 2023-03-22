import { Body, MapDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import axios from 'axios';

export const findMapById = async (id: string): Promise<MapDto> => {
  try {
    const response = await axios.get<Body<MapDto>>(`${baseApiUrl}/api/maps/${id}`);
    return response.data.data;
  } catch (error) {
    throw error as Error;
  }
};
