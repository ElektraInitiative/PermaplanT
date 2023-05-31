/**
 * @module this module contains actions for the plant layer.
 */
import { createPlanting } from '../../api/createPlanting';
import { deletePlanting } from '../../api/deletePlanting';
import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { PlantLayerObjectDto } from '@/bindings/definitions';
import * as uuid from 'uuid';

export class CreatePlantAction
  implements Action<Awaited<ReturnType<typeof createPlanting>>, boolean>
{
  private readonly _id: string = uuid.v4();

  constructor(private readonly _data: Omit<PlantLayerObjectDto, 'id'>) {}

  reverse() {
    return new DeletePlantAction(this._id);
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        Plant: {
          ...state.layers.Plant,
          objects: [
            ...state.layers.Plant.objects,
            {
              ...this._data,
              id: this._id,
            },
          ],
        },
      },
    };
  }

  async execute(): Promise<Awaited<ReturnType<typeof createPlanting>>> {
    return createPlanting({
      ...this._data,
      // TODO - get these values from the store.
      map_id: 1,
      plant_id: this._data.plantId,
      id: this._id,
    });
  }
}

export class DeletePlantAction
  implements Action<boolean, Awaited<ReturnType<typeof createPlanting>>>
{
  constructor(private readonly _id: string) {}

  async execute(): Promise<boolean> {
    return deletePlanting(this._id);
  }

  reverse(state: TrackedMapState) {
    const plant = state.layers.Plant.objects.find((obj) => obj.id === this._id);

    if (!plant) {
      return null;
    }

    const data = {
      ...plant,
      id: undefined, // the create actions should generate a new id.
    };

    return new CreatePlantAction(data);
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        Plant: {
          ...state.layers.Plant,
          objects: state.layers.Plant.objects.filter((p) => p.id !== this._id),
        },
      },
    };
  }
}
