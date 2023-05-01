import { NewBaseLayerDto } from '../../../bindings/definitions';
import { baseApiUrl } from '../../../config';
import axios from 'axios';

export const createBaseLayer = async (baseLayer: NewBaseLayerDto) => {
  try {
    await axios.post<NewBaseLayerDto>(`${baseApiUrl}/api/base_layers`, baseLayer);
  } catch (error) {
    throw error as Error;
  }
};
