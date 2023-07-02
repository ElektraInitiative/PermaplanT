import { createAPI } from '@/config/axios';
import { PhotoDto, TransformPhotoDto, UpdatePhotoDto } from '../store/MapStoreTypes';

export const transformPhoto = async (
  mapId: number,
  id: string,
  photo: Required<Pick<TransformPhotoDto, 'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation'>>,
): Promise<PhotoDto> => {
  const http = createAPI();

  const dto: UpdatePhotoDto = {
    type: 'Transform',
    content: photo,
  };

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/photos/${id}`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
