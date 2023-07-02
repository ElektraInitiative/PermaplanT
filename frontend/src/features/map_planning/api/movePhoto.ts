import { createAPI } from '@/config/axios';
import { MovePhotoDto, PhotoDto, UpdatePhotoDto } from '../store/MapStoreTypes';

export const movePhoto = async (
  mapId: number,
  id: string,
  photo: Required<Pick<MovePhotoDto, 'x' | 'y'>>,
): Promise<PhotoDto> => {
  const http = createAPI();

  const dto: UpdatePhotoDto = {
    type: 'Move',
    content: photo,
  };

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/photos/${id}`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
