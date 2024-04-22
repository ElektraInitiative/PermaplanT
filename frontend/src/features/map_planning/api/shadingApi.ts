import {
  ActionDtoWrapper,
  DeletePlantingDto,
  DeleteShadingDto,
  NewShadingDto,
  ShadingDto,
  UpdateAddDateShadingDto,
  UpdateRemoveDateShadingDto,
  UpdateShadingDto,
  UpdateValuesShadingDto,
} from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function createShading(
  mapId: number,
  actionId: string,
  shadings: NewShadingDto[],
): Promise<ShadingDto> {
  const http = createAPI();

  const dto: ActionDtoWrapper<NewShadingDto[]> = {
    actionId: actionId,
    dto: shadings,
  };

  try {
    const response = await http.post<ShadingDto>(`api/maps/${mapId}/layers/shade/shadings`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}

export const deleteShading = async (
  mapId: number,
  actionId: string,
  shadings: DeleteShadingDto[],
): Promise<boolean> => {
  const http = createAPI();

  const dto: ActionDtoWrapper<DeletePlantingDto[]> = {
    actionId: actionId,
    dto: shadings,
  };

  try {
    const response = await http.delete(`api/maps/${mapId}/layers/shade/shadings/`, {
      data: dto,
    });
    return Boolean(response.data);
  } catch (error) {
    throw error as Error;
  }
};

export const updateShadingContent = async (
  mapId: number,
  actionId: string,
  updates: UpdateValuesShadingDto[],
): Promise<ShadingDto> => {
  const http = createAPI();

  const dto: ActionDtoWrapper<UpdateShadingDto> = {
    actionId: actionId,
    dto: {
      type: 'Update',
      content: updates,
    },
  };

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/shade/shadings/`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};

/** REFACTOR Consider adding a common mechanism for add dates and remove dates. */
export const updateShadingAddDate = async (
  mapId: number,
  actionId: string,
  updates: UpdateAddDateShadingDto[],
): Promise<ShadingDto> => {
  const http = createAPI();

  const dto: ActionDtoWrapper<UpdateShadingDto> = {
    actionId: actionId,
    dto: {
      type: 'UpdateAddDate',
      content: updates,
    },
  };

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/shade/shadings/`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};

export const updateShadingRemoveDate = async (
  mapId: number,
  actionId: string,
  updates: UpdateRemoveDateShadingDto[],
): Promise<ShadingDto> => {
  const http = createAPI();

  const dto: ActionDtoWrapper<UpdateShadingDto> = {
    actionId: actionId,
    dto: {
      type: 'UpdateRemoveDate',
      content: updates,
    },
  };

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/shade/shadings/`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
};
