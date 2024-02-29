import { ActionDtoWrapper, TimelinePage } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';
import { DrawingDto } from '../layers/drawing/types';

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
    const response = await http.get<TimelinePage<DrawingDto>>(
      `api/maps/${mapId}/drawings?${params}`,
    );
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

/*
export async function deletePlanting(mapId: number, actionId: string, data: DeletePlantingDto[]) {
  const http = createAPI();

  const dto: ActionDtoWrapper<DeletePlantingDto[]> = {
    actionId: actionId,
    dto: data,
  };

  try {
    const response = await http.delete<boolean>(`api/maps/${mapId}/layers/plants/plantings`, {
      data: dto,
    });
    return Boolean(response.data);
  } catch (error) {
    throw error as Error;
  }
}

export async function movePlanting(mapId: number, actionId: string, updates: MovePlantingDto[]) {
  const http = createAPI();

  const dto: ActionDtoWrapper<UpdatePlantingDto> = {
    actionId: actionId,
    dto: {
      type: 'Move',
      content: updates,
    },
  };

  try {
    const response = await http.patch<PlantingDto[]>(
      `api/maps/${mapId}/layers/plants/plantings`,
      dto,
    );
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}

export async function transformPlanting(
  mapId: number,
  actionId: string,
  updates: TransformPlantingDto[],
): Promise<PlantingDto> {
  const http = createAPI();

  const dto: ActionDtoWrapper<UpdatePlantingDto> = {
    actionId: actionId,
    dto: {
      type: 'Transform',
      content: updates,
    },
  };

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/plants/plantings`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}

export default async function updateAddDatePlanting(
  mapId: number,
  actionId: string,
  updates: UpdateAddDatePlantingDto[],
) {
  const http = createAPI();

  const dto: ActionDtoWrapper<UpdatePlantingDto> = {
    actionId: actionId,
    dto: {
      type: 'UpdateAddDate',
      content: updates,
    },
  };

  try {
    const response = await http.patch(`api/maps/${mapId}/layers/plants/plantings`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}

export async function updateRemoveDatePlanting(
  mapId: number,
  actionId: string,
  updates: UpdateRemoveDatePlantingDto[],
) {
  const http = createAPI();

  const dto: ActionDtoWrapper<UpdatePlantingDto> = {
    actionId: actionId,
    dto: {
      type: 'UpdateRemoveDate',
      content: updates,
    },
  };
  try {
    const response = await http.patch(`api/maps/${mapId}/layers/plants/plantings`, dto);
    return response.data;
  } catch (error) {
    throw error as Error;
  }
}
*/
