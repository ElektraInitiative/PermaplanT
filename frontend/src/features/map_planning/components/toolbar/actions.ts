/**
 * @module this module contains actions for the drawing layer.

import { v4 } from 'uuid';
import { DrawingDto, LayerType, NewLayerDto } from '@/api_types/definitions';
import { createLayer } from '../../api/createLayer';
import { createDrawing, deleteDrawing } from '../../api/drawingApi';
import useMapStore from '../../store/MapStore';
import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { filterVisibleObjects } from '../../utils/filterVisibleObjects';
import { deleteLayer } from '../../api/deleteLayer';

export class CreateLayerAction implements Action<Awaited<ReturnType<typeof createLayer>>, boolean> {
  get entityIds() {
    return [this._layer.layer_id];
  }

  constructor(
    private readonly _layer: NewLayerDto,
    private readonly drawings: DrawingDto[],
    public actionId = v4(),
  ) {}

  reverse() {
    return new DeleteLayerAction(this._layer.layer_id, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    const timelineDate = useMapStore.getState().untrackedState.timelineDate;

    const newLayer = {
      ...this._layer,
      objects: filterVisibleObjects(this.drawings, timelineDate) || [],
      loadedObjects: this.drawings || [],
    };

    return {
      ...state,
      layers: {
        ...state.layers,
        drawing: {
          ...state.layers.drawing,
          [this._layer.layer_id]: newLayer,
        },
      },
    };
  }

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof createLayer>>> {
    return createLayer(mapId, LayerType.Drawing, this._layer.name);
  }
}

export class DeleteLayerAction
  implements Action<boolean, Awaited<ReturnType<typeof createDrawing>>>
{
  constructor(private readonly layerId: string, public actionId = v4()) {}

  get entityIds() {
    return [this.layerId];
  }

  async execute(mapId: number): Promise<boolean> {
    return deleteLayer(mapId, this.layerId);
  }

  reverse(state: TrackedMapState) {
    const drawings = state.layers.drawing.objects.filter((obj) => this._data.includes(obj.id));

    if (!drawings || drawings.length < 1) {
      return null;
    }

    return new CreateLayerAction(drawings, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        drawing: {
          ...state.layers.drawing,
          objects: state.layers.drawing.objects.filter((p) => !this._data.includes(p.id)),
          loadedObjects: state.layers.drawing.loadedObjects.filter(
            (p) => !this._data.includes(p.id),
          ),
        },
      },
    };
  }
}
 */
