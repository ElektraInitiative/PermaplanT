import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { BaseLayerImageDto, LayerType, UpdateBaseLayerImageDto } from '@/bindings/definitions';
import { updateBaseLayer } from './api/updateBaseLayer';

export class UpdateBaseLayerAction implements
    Action<Awaited<ReturnType<typeof updateBaseLayer>>, Awaited<ReturnType<typeof updateBaseLayer>>>
 {
  constructor(private readonly _data: BaseLayerImageDto) {}

  reverse(state: TrackedMapState) {
    return new UpdateBaseLayerAction({
      id: state.layers.base.imageId,
      path: state.layers.base.nextcloudImagePath,
      layer_id: state.layers.base.layerId,
      rotation: state.layers.base.rotation,
      scale: state.layers.base.scale
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

  execute(mapId: number): Promise<UpdateBaseLayerImageDto> {
    console.log(this._data)
    return updateBaseLayer(this._data.id, mapId, this._data)
  }
}
