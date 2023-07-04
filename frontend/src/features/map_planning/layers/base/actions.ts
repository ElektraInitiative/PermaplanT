import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { LayerType } from '@/bindings/definitions';
import { updateBaseLayer } from './api/updateBaseLayer';

//TODO: remove when implemented in backend
export type UpdateBaseLayerDto = {
    rotation: number,
    scale: number,
    nextcloudImagePath: string,
}

export class UpdateBaseLayerAction implements
    Action<Awaited<ReturnType<typeof updateBaseLayer>>, Awaited<ReturnType<typeof updateBaseLayer>>>
 {
  constructor(private readonly _data: UpdateBaseLayerDto) {}

  reverse(state: TrackedMapState) {
    return new UpdateBaseLayerAction({
      ...state.layers.base
    });
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        [LayerType.Base]: {
          ...state.layers.base,
          ...this._data
        },
      },
    };
  }

  execute(mapId: number): Promise<UpdateBaseLayerDto> {
    return updateBaseLayer(mapId, this._data)
  }
}
