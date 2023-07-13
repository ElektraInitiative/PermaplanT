import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { updateBaseLayer } from './api/updateBaseLayer';
import { BaseLayerImageDto, LayerType, UpdateBaseLayerImageDto } from '@/bindings/definitions';

export class UpdateBaseLayerAction
  implements
    Action<
      Awaited<ReturnType<typeof updateBaseLayer>>,
      Awaited<ReturnType<typeof updateBaseLayer>>
    >
{
  constructor(private readonly _data: BaseLayerImageDto) {}

  reverse(state: TrackedMapState) {
    return new UpdateBaseLayerAction({
      id: state.layers.base.imageId,
      path: state.layers.base.nextcloudImagePath,
      layer_id: state.layers.base.layerId,
      rotation: state.layers.base.rotation,
      scale: state.layers.base.scale,
    });
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        [LayerType.Base]: {
          imageId: this._data.id,
          layerId: this._data.layer_id,
          rotation: this._data.rotation,
          scale: this._data.scale,
          nextcloudImagePath: this._data.path,
        },
      },
    };
  }

  execute(mapId: number): Promise<UpdateBaseLayerImageDto> {
    console.log(this._data);
    return updateBaseLayer(this._data.id, mapId, this._data);
  }
}
