/**
 * @module this module contains actions for the plant layer.
 */
import { createPlanting } from '../../api/createPlanting';
import { deletePlanting } from '../../api/deletePlanting';
import { movePlanting } from '../../api/movePlanting';
import { transformPlanting } from '../../api/transformPlanting';
import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { PlantingDto } from '@/bindings/definitions';

export class CreatePlantAction
  implements Action<Awaited<ReturnType<typeof createPlanting>>, boolean>
{
  private readonly _id: string;

  constructor(private readonly _data: PlantingDto) {
    this._id = _data.id;
  }

  reverse() {
    return new DeletePlantAction(this._id);
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        plants: {
          ...state.layers.plants,
          objects: [
            ...state.layers.plants.objects,
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
    return createPlanting(1, {
      ...this._data,
      // TODO - get these values from the store.
      id: this._id,
    });
  }
}

export class DeletePlantAction
  implements Action<boolean, Awaited<ReturnType<typeof createPlanting>>>
{
  constructor(private readonly _id: string) {}

  async execute(): Promise<boolean> {
    return deletePlanting(1, this._id);
  }

  reverse(state: TrackedMapState) {
    const plant = state.layers.plants.objects.find((obj) => obj.id === this._id);

    if (!plant) {
      return null;
    }

    return new CreatePlantAction(plant);
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        plants: {
          ...state.layers.plants,
          objects: state.layers.plants.objects.filter((p) => p.id !== this._id),
        },
      },
    };
  }
}

export class MovePlantAction
  implements
    Action<Awaited<ReturnType<typeof movePlanting>>[], Awaited<ReturnType<typeof movePlanting>>[]>
{
  private readonly _ids: Array<string>;

  constructor(private readonly _data: Array<Pick<PlantingDto, 'x' | 'y' | 'id'>>) {
    this._ids = _data.map((d) => d.id);
  }

  reverse(state: TrackedMapState) {
    const plants = state.layers.plants.objects.filter((obj) => this._ids.includes(obj.id));

    if (!plants.length) {
      return null;
    }

    return new MovePlantAction(plants.map((p) => ({ id: p.id, x: p.x, y: p.y })));
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        plants: {
          ...state.layers.plants,
          objects: state.layers.plants.objects.map((p) => {
            if (this._ids.includes(p.id)) {
              return {
                ...p,
                x: this._data.find((d) => d.id === p.id)?.x ?? p.x,
                y: this._data.find((d) => d.id === p.id)?.y ?? p.y,
              };
            }

            return p;
          }),
        },
      },
    };
  }

  execute(): Promise<PlantingDto[]> {
    const tasks = this._data.map((d) =>
      movePlanting(1, d.id, {
        // TODO - get these values from the store.
        x: d.x,
        y: d.y,
      }),
    );

    return Promise.all(tasks);
  }
}

export class TransformPlantAction
  implements
    Action<Awaited<ReturnType<typeof movePlanting>>[], Awaited<ReturnType<typeof movePlanting>>[]>
{
  private readonly _ids: Array<string>;

  constructor(
    private readonly _data: Array<
      Pick<PlantingDto, 'x' | 'y' | 'id' | 'scaleX' | 'scaleY' | 'rotation'>
    >,
  ) {
    this._ids = _data.map((d) => d.id);
  }

  reverse(state: TrackedMapState) {
    const plants = state.layers.plants.objects.filter((obj) => this._ids.includes(obj.id));

    if (!plants.length) {
      return null;
    }

    return new TransformPlantAction(
      plants.map((p) => ({
        id: p.id,
        x: p.x,
        y: p.y,
        scaleX: p.scaleX,
        scaleY: p.scaleY,
        rotation: p.rotation,
      })),
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        plants: {
          ...state.layers.plants,
          objects: state.layers.plants.objects.map((p) => {
            if (this._ids.includes(p.id)) {
              return {
                ...p,
                x: this._data.find((d) => d.id === p.id)?.x ?? p.x,
                y: this._data.find((d) => d.id === p.id)?.y ?? p.y,
                scaleX: this._data.find((d) => d.id === p.id)?.scaleX ?? p.scaleX,
                scaleY: this._data.find((d) => d.id === p.id)?.scaleY ?? p.scaleY,
                rotation: this._data.find((d) => d.id === p.id)?.rotation ?? p.rotation,
              };
            }

            return p;
          }),
        },
      },
    };
  }

  execute(): Promise<PlantingDto[]> {
    const tasks = this._data.map((d) =>
      transformPlanting(1, d.id, {
        // TODO - get these values from the store.
        x: d.x,
        y: d.y,
        scaleX: d.scaleX,
        scaleY: d.scaleY,
        rotation: d.rotation,
      }),
    );

    return Promise.all(tasks);
  }
}
