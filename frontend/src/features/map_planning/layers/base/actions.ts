import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { updateBaseLayer } from './api/updateBaseLayer';
import {
  BaseLayerImageDto,
  LayerType,
  MapDto,
  UpdateBaseLayerImageDto,
  UpdateMapDto,
} from '@/api_types/definitions';
import { PolygonGeometry } from '@/features/map_planning/layers/base/components/polygon/PolygonTypes';
import { updateMap } from '@/features/maps/api/updateMap';
import { v4 } from 'uuid';

export class UpdateBaseLayerAction
  implements
    Action<
      Awaited<ReturnType<typeof updateBaseLayer>>,
      Awaited<ReturnType<typeof updateBaseLayer>>
    >
{
  constructor(
    private readonly _data: Omit<BaseLayerImageDto, 'action_id'>,
    public actionId = v4(),
  ) {}

  get entityIds() {
    return [this._data.id];
  }

  reverse(state: TrackedMapState) {
    return new UpdateBaseLayerAction(
      {
        id: state.layers.base.imageId,
        path: state.layers.base.nextcloudImagePath,
        layer_id: state.layers.base.layerId,
        rotation: state.layers.base.rotation,
        scale: state.layers.base.scale,
      },
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        [LayerType.Base]: {
          ...state.layers.base,
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
    return updateBaseLayer(this._data.id, mapId, { ...this._data, action_id: this.actionId });
  }
}

export class UpdateMapGeometry
  implements Action<Awaited<ReturnType<typeof updateMap>>, Awaited<ReturnType<typeof updateMap>>>
{
  constructor(private readonly _data: Pick<UpdateMapDto, 'geometry'>, public actionId = v4()) {}

  get entityIds() {
    return [];
  }

  reverse(state: TrackedMapState) {
    return new UpdateMapGeometry(
      {
        geometry: state.mapBounds,
      },
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    if (!this._data.geometry) {
      return state;
    }

    return {
      ...state,
      mapBounds: this._data.geometry as PolygonGeometry,
    };
  }

  execute(mapId: number): Promise<MapDto> {
    return updateMap({ geometry: this._data }, mapId);
  }
}
