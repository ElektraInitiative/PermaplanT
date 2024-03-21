import {
  ActionDtoWrapper,
  DrawingDto,
  UpdateAddDateDrawingDto,
  UpdateDrawingsDto,
  UpdateRemoveDateDrawingDto,
} from '@/api_types/definitions';
import { createAPI } from '@/config/axios';

export async function getDrawings(
  mapId: number,
  searchParams: {
    layer_id: number;
    relative_to_date: string;
  },
) {
  const http = createAPI();

  const params = new URLSearchParams({
    layer_id: searchParams.layer_id.toString(),
    relative_to_date: searchParams.relative_to_date,
  });

  try {
    const response = await http.get<DrawingDto[]>(`api/maps/${mapId}/drawings?${params}`);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}

export async function createDrawing(mapId: number, actionId: string, data: DrawingDto[]) {
  const http = createAPI();

  const dto: ActionDtoWrapper<DrawingDto[]> = {
    actionId: actionId,
    dto: data,
  };

  try {
    const response = await http.post<DrawingDto[]>(`api/maps/${mapId}/drawings`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}

export async function deleteDrawing(mapId: number, actionId: string, ids: string[]) {
  const http = createAPI();

  const dto: ActionDtoWrapper<string[]> = {
    actionId: actionId,
    dto: ids,
  };

  try {
    const response = await http.delete<boolean>(`api/maps/${mapId}/drawings`, {
      data: dto,
    });
    return Boolean(response.data);
  } catch (error) {
    throw error as Error;
  }
}

export async function updateDrawing(mapId: number, actionId: string, data: DrawingDto[]) {
  const http = createAPI();

  const dto: ActionDtoWrapper<UpdateDrawingsDto> = {
    actionId: actionId,
    dto: {
      type: 'Update',
      content: data,
    },
  };

  try {
    const response = await http.patch<UpdateDrawingsDto[]>(`api/maps/${mapId}/drawings`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}

export default async function updateDrawingAddDate(
  mapId: number,
  actionId: string,
  updates: UpdateAddDateDrawingDto[],
) {
  const http = createAPI();

  const dto: ActionDtoWrapper<UpdateDrawingsDto> = {
    actionId: actionId,
    dto: {
      type: 'UpdateAddDate',
      content: updates,
    },
  };

  try {
    const response = await http.patch(`api/maps/${mapId}/drawings`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}

export async function updateDrawingRemoveDate(
  mapId: number,
  actionId: string,
  updates: UpdateRemoveDateDrawingDto[],
) {
  const http = createAPI();

  const dto: ActionDtoWrapper<UpdateDrawingsDto> = {
    actionId: actionId,
    dto: {
      type: 'UpdateRemoveDate',
      content: updates,
    },
  };
  try {
    const response = await http.patch(`api/maps/${mapId}/drawings`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
