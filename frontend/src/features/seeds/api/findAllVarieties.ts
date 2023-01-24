import { ResponseBody } from '@/types';
import { VarietyDTO } from '@/bindings/definitions';
import axios from 'axios';
import { baseApiUrl } from '@/config';

export const findAllVarieties = async (): Promise<VarietyDTO[]> => {
  try {
    const response = await axios.get<ResponseBody<VarietyDTO[]>>(`${baseApiUrl}/api/varieties`);
    return response.data.data;
  } catch (error) {
    throw error as Error;
  }
};
