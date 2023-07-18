/**
 * @module this module contains actions for the plant layer.
 */
import { createPlanting } from '../../api/createPlanting';
import { deletePlanting } from '../../api/deletePlanting';
import { movePlanting } from '../../api/movePlanting';
import { transformPlanting } from '../../api/transformPlanting';
import { updateAddDatePlanting } from '../../api/updateAddDatePlanting';
import { updateRemoveDatePlanting } from '../../api/updateRemoveDatePlanting';
import useMapStore from '../../store/MapStore';
import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { filterVisibleObjects } from '../../utils/filterVisibleObjects';
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
    const newPlant = {
      ...this._data,
      id: this._id,
    };

    const timelineDate = useMapStore.getState().untrackedState.timelineDate;

    return {
      ...state,
      layers: {
        ...state.layers,
        plants: {
          ...state.layers.plants,
          objects: filterVisibleObjects(
            [...state.layers.plants.objects, { ...newPlant }],
            timelineDate,
          ),
          loadedObjects: [...state.layers.plants.loadedObjects, { ...newPlant }],
        },
      },
    };
  }

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof createPlanting>>> {
    return createPlanting(mapId, {
      ...this._data,
      id: this._id,
    });
  }
}

export class DeletePlantAction
  implements Action<boolean, Awaited<ReturnType<typeof createPlanting>>>
{
  constructor(private readonly _id: string) {}

  async execute(mapId: number): Promise<boolean> {
    return deletePlanting(mapId, this._id);
  }

  reverse(state: TrackedMapState) {
    const plant = state.layers.plants.loadedObjects.find((obj) => obj.id === this._id);

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
          loadedObjects: state.layers.plants.loadedObjects.filter((p) => p.id !== this._id),
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
    const plants = state.layers.plants.loadedObjects.filter((obj) => this._ids.includes(obj.id));

    if (!plants.length) {
      return null;
    }

    return new MovePlantAction(plants.map((p) => ({ id: p.id, x: p.x, y: p.y })));
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updatePlants = (plants: Array<PlantingDto>) => {
      return plants.map((p) => {
        if (this._ids.includes(p.id)) {
          return {
            ...p,
            x: this._data.find((d) => d.id === p.id)?.x ?? p.x,
            y: this._data.find((d) => d.id === p.id)?.y ?? p.y,
          };
        }

        return p;
      });
    };

    return {
      ...state,
      layers: {
        ...state.layers,
        plants: {
          ...state.layers.plants,
          objects: updatePlants(state.layers.plants.objects),
          loadedObjects: updatePlants(state.layers.plants.loadedObjects),
        },
      },
    };
  }

  execute(mapId: number): Promise<PlantingDto[]> {
    const tasks = this._data.map((d) =>
      movePlanting(mapId, d.id, {
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
    const plants = state.layers.plants.loadedObjects.filter((obj) => this._ids.includes(obj.id));

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
    const updatePlants = (plants: Array<PlantingDto>) => {
      return plants.map((p) => {
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
      });
    };

    return {
      ...state,
      layers: {
        ...state.layers,
        plants: {
          ...state.layers.plants,
          objects: updatePlants(state.layers.plants.objects),
          loadedObjects: updatePlants(state.layers.plants.loadedObjects),
        },
      },
    };
  }

  execute(mapId: number): Promise<PlantingDto[]> {
    const tasks = this._data.map((d) =>
      transformPlanting(mapId, d.id, {
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

export class UpdateAddDatePlantAction
  implements
    Action<
      Awaited<ReturnType<typeof updateAddDatePlanting>>,
      Awaited<ReturnType<typeof updateAddDatePlanting>>
    >
{
  constructor(private readonly _data: Pick<PlantingDto, 'addDate' | 'id'>) {}

  reverse(state: TrackedMapState) {
    const plant = state.layers.plants.loadedObjects.find((obj) => obj.id === this._data.id);

    if (!plant) {
      return null;
    }

    return new UpdateAddDatePlantAction({
      id: plant.id,
      addDate: plant.addDate,
    });
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updatePlants = (plants: Array<PlantingDto>) => {
      return plants.map((p) => {
        if (p.id === this._data.id) {
          return {
            ...p,
            addDate: this._data.addDate,
          };
        }

        return p;
      });
    };

    const timelineDate = useMapStore.getState().untrackedState.timelineDate;

    return {
      ...state,
      layers: {
        ...state.layers,
        plants: {
          ...state.layers.plants,
          objects: filterVisibleObjects(updatePlants(state.layers.plants.objects), timelineDate),
          loadedObjects: updatePlants(state.layers.plants.loadedObjects),
        },
      },
    };
  }

  execute(mapId: number): Promise<PlantingDto> {
    return updateAddDatePlanting(mapId, this._data.id, { addDate: this._data.addDate });
  }
}

export class UpdateRemoveDatePlantAction
  implements
    Action<
      Awaited<ReturnType<typeof updateRemoveDatePlanting>>,
      Awaited<ReturnType<typeof updateRemoveDatePlanting>>
    >
{
  constructor(private readonly _data: Pick<PlantingDto, 'removeDate' | 'id'>) {}

  reverse(state: TrackedMapState) {
    const plant = state.layers.plants.loadedObjects.find((obj) => obj.id === this._data.id);

    if (!plant) {
      return null;
    }

    return new UpdateRemoveDatePlantAction({
      id: plant.id,
      removeDate: plant.addDate,
    });
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updatePlants = (plants: Array<PlantingDto>) => {
      return plants.map((p) => {
        if (p.id === this._data.id) {
          return {
            ...p,
            removeDate: this._data.removeDate,
          };
        }

        return p;
      });
    };

    const timelineDate = useMapStore.getState().untrackedState.timelineDate;

    return {
      ...state,
      layers: {
        ...state.layers,
        plants: {
          ...state.layers.plants,
          objects: filterVisibleObjects(updatePlants(state.layers.plants.objects), timelineDate),
          loadedObjects: updatePlants(state.layers.plants.loadedObjects),
        },
      },
    };
  }

  execute(mapId: number): Promise<PlantingDto> {
    return updateRemoveDatePlanting(mapId, this._data.id, { removeDate: this._data.removeDate });
  }
}
