import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { updateBaseLayer } from './api/updateBaseLayer';
import {
  BaseLayerImageDto,
  LayerType,
  MapDto,
  UpdateBaseLayerImageDto,
  UpdateMapGeometryActionPayload,
} from '@/api_types/definitions';
import { updateMapGeometry } from '@/features/map_planning/api/updateMapGeometry';
import { PolygonGeometry } from '@/features/map_planning/types/PolygonTypes';
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
  constructor(
    private readonly _data: Omit<UpdateMapGeometryActionPayload, 'actionId' | 'userId'>,
    public actionId = v4(),
  ) {}

  get entityIds() {
    return [this._data.mapId.toString()];
  }

  reverse(state: TrackedMapState) {
    return new UpdateMapGeometry(
      { mapId: this._data.mapId, geometry: state.mapBounds as object },
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    if (!this._data) {
      return state;
    }

    return {
      ...state,
      mapBounds: this._data.geometry as PolygonGeometry,
    };
  }

  execute(mapId: number): Promise<MapDto> {
    return updateMapGeometry({ geometry: this._data.geometry }, mapId);
  }
}
