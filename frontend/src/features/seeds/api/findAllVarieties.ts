import { ResponseBody } from '@/types';
import { VarietyDto } from '@/bindings/definitions';
import axios from 'axios';
import { baseApiUrl } from '@/config';

export const findAllVarieties = async (): Promise<VarietyDto[]> => {
  try {
    const response = await axios.get<ResponseBody<VarietyDto[]>>(`${baseApiUrl}/api/varieties`);
    return response.data.data;
  } catch (error) {
    throw error as Error;
  }
};
