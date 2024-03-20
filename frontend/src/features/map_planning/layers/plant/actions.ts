/**
 * @module this module contains actions for the plant layer.
 */
import { v4 } from 'uuid';
import {
  PlantingDto,
  CreatePlantActionPayload,
  DeletePlantActionPayload,
  MovePlantActionPayload,
  TransformPlantActionPayload,
  UpdatePlantingAddDateActionPayload,
  UpdatePlantingRemoveDateActionPayload,
  UpdatePlantingAdditionalNamePayload,
  UpdatePlantingNoteActionPayload,
} from '@/api_types/definitions';
import updateAddDatePlanting, {
  createPlanting,
  deletePlanting,
  movePlanting,
  transformPlanting,
  updatePlantingNotes,
  updateRemoveDatePlanting,
} from '../../api/plantingApi';
import useMapStore from '../../store/MapStore';
import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { filterVisibleObjects } from '../../utils/filterVisibleObjects';

export class CreatePlantAction
  implements Action<Awaited<ReturnType<typeof createPlanting>>, boolean>
{
  private readonly _ids: string[];

  get entityIds() {
    return this._ids;
  }

  constructor(private readonly _data: CreatePlantActionPayload[], public actionId = v4()) {
    this._ids = _data.map(({ id }) => id);
  }

  reverse() {
    return new DeletePlantAction(
      this._ids.map((id) => ({ id })),
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const timelineDate = useMapStore.getState().untrackedState.timelineDate;

    return {
      ...state,
      layers: {
        ...state.layers,
        plants: {
          ...state.layers.plants,
          objects: filterVisibleObjects(
            [...state.layers.plants.objects, ...this._data],
            timelineDate,
          ),
          loadedObjects: [...state.layers.plants.loadedObjects, ...this._data],
        },
      },
    };
  }

  async execute(mapId: number) {
    return createPlanting(mapId, this.actionId, this._data);
  }
}

export class DeletePlantAction
  implements Action<boolean, Awaited<ReturnType<typeof createPlanting>>>
{
  private readonly _ids: string[];
  constructor(private readonly _data: DeletePlantActionPayload[], public actionId = v4()) {
    this._ids = this._data.map(({ id }) => id);
  }

  get entityIds() {
    return this._ids;
  }

  async execute(mapId: number) {
    return deletePlanting(mapId, this.actionId, this._data);
  }

  reverse(state: TrackedMapState) {
    const plants = filterByIds(state.layers.plants.loadedObjects, this._ids);

    if (!plants.length) {
      return null;
    }

    return new CreatePlantAction(plants, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        plants: {
          ...state.layers.plants,
          objects: state.layers.plants.objects.filter((p) => !this._ids.includes(p.id)),
          loadedObjects: state.layers.plants.objects.filter((p) => !this._ids.includes(p.id)),
        },
      },
    };
  }
}

export class MovePlantAction
  implements
    Action<Awaited<ReturnType<typeof movePlanting>>, Awaited<ReturnType<typeof movePlanting>>>
{
  private readonly _ids: string[];

  get entityIds() {
    return this._ids;
  }

  constructor(private readonly _data: MovePlantActionPayload[], public actionId = v4()) {
    this._ids = _data.map(({ id }) => id);
  }

  reverse(state: TrackedMapState) {
    const plants = filterByIds(state.layers.plants.loadedObjects, this._ids);

    if (!plants.length) {
      return null;
    }

    return new MovePlantAction(
      plants.map((p) => ({ id: p.id, x: p.x, y: p.y })),
      this.actionId,
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

  execute(mapId: number) {
    return movePlanting(mapId, this.actionId, this._data);
  }
}

export class TransformPlantAction
  implements
    Action<
      Awaited<ReturnType<typeof transformPlanting>>,
      Awaited<ReturnType<typeof transformPlanting>>
    >
{
  private readonly _ids: string[];

  get entityIds() {
    return this._ids;
  }

  constructor(private readonly _data: TransformPlantActionPayload[], public actionId = v4()) {
    this._ids = _data.map((d) => d.id);
  }

  reverse(state: TrackedMapState) {
    const plants = filterByIds(state.layers.plants.loadedObjects, this._ids);

    if (!plants.length) {
      return null;
    }

    return new TransformPlantAction(
      plants.map((p) => ({
        id: p.id,
        x: p.x,
        y: p.y,
        sizeX: p.sizeX,
        sizeY: p.sizeY,
        rotation: p.rotation,
      })),
      this.actionId,
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
            sizeX: this._data.find((d) => d.id === p.id)?.sizeX ?? p.sizeX,
            sizeY: this._data.find((d) => d.id === p.id)?.sizeY ?? p.sizeY,
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

  execute(mapId: number) {
    return transformPlanting(mapId, this.actionId, this._data);
  }
}

export class UpdateAddDatePlantAction
  implements
    Action<
      Awaited<ReturnType<typeof updateAddDatePlanting>>,
      Awaited<ReturnType<typeof updateAddDatePlanting>>
    >
{
  private readonly _ids: string[];

  constructor(
    private readonly _data: UpdatePlantingAddDateActionPayload[],
    public actionId = v4(),
  ) {
    this._ids = this._data.map(({ id }) => id);
  }

  get entityIds() {
    return this._ids;
  }

  reverse(state: TrackedMapState) {
    const plants = filterByIds(state.layers.plants.loadedObjects, this._ids);

    if (!plants.length) {
      return null;
    }

    return new UpdateAddDatePlantAction(
      plants.map((p) => ({
        id: p.id,
        addDate: p.addDate,
      })),
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updatePlants = (plants: Array<PlantingDto>) => {
      return plants.map((p) => {
        if (this._ids.includes(p.id)) {
          return {
            ...p,
            addDate: this._data.find((d) => d.id === p.id)?.addDate ?? p.addDate,
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
          objects: filterVisibleObjects(
            updatePlants(state.layers.plants.loadedObjects),
            timelineDate,
          ),
          loadedObjects: updatePlants(state.layers.plants.loadedObjects),
        },
      },
    };
  }

  execute(mapId: number): Promise<PlantingDto> {
    return updateAddDatePlanting(mapId, this.actionId, this._data);
  }
}

export class UpdatePlantingNotesAction
  implements
    Action<
      Awaited<ReturnType<typeof updatePlantingNotes>>,
      Awaited<ReturnType<typeof updatePlantingNotes>>
    >
{
  private readonly _ids: string[];

  constructor(private readonly _data: UpdatePlantingNoteActionPayload[], public actionId = v4()) {
    this._ids = this._data.map(({ id }) => id);
  }

  get entityIds() {
    return this._ids;
  }

  reverse(state: TrackedMapState) {
    const plants = filterByIds(state.layers.plants.loadedObjects, this._ids);

    if (!plants.length) {
      return null;
    }

    return new UpdatePlantingNotesAction(
      plants.map((p) => ({
        id: p.id,
        notes: p.plantingNotes || '',
      })),
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updatePlants = (plants: Array<PlantingDto>) => {
      return plants.map((p) => {
        if (this._ids.includes(p.id)) {
          return {
            ...p,
            plantingNotes: this._data.find((d) => d.id === p.id)?.notes ?? p.plantingNotes,
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

  execute(mapId: number): Promise<PlantingDto> {
    return updatePlantingNotes(mapId, this.actionId, this._data);
  }
}

export class UpdateRemoveDatePlantAction
  implements
    Action<
      Awaited<ReturnType<typeof updateRemoveDatePlanting>>,
      Awaited<ReturnType<typeof updateRemoveDatePlanting>>
    >
{
  private readonly _ids: string[];

  constructor(
    private readonly _data: UpdatePlantingRemoveDateActionPayload[],
    public actionId = v4(),
  ) {
    this._ids = _data.map(({ id }) => id);
  }

  get entityIds() {
    return this._ids;
  }

  reverse(state: TrackedMapState) {
    const plants = filterByIds(state.layers.plants.loadedObjects, this._ids);

    if (!plants.length) {
      return null;
    }

    return new UpdateRemoveDatePlantAction(
      this._data.map((p) => ({ id: p.id, removeDate: p.removeDate })),
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updatePlants = (plants: Array<PlantingDto>) => {
      return plants.map((p) => {
        if (this._ids.includes(p.id)) {
          return {
            ...p,
            removeDate: this._data.find((d) => d.id === p.id)?.removeDate ?? p.removeDate,
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
          objects: filterVisibleObjects(
            updatePlants(state.layers.plants.loadedObjects),
            timelineDate,
          ),
          loadedObjects: updatePlants(state.layers.plants.loadedObjects),
        },
      },
    };
  }

  execute(mapId: number): Promise<PlantingDto> {
    return updateRemoveDatePlanting(mapId, this.actionId, this._data);
  }
}

export type UpdatePlantingAdditionalNameParam = Omit<
  UpdatePlantingAdditionalNamePayload,
  'userId' | 'actionId'
>;
export class UpdatePlantingAdditionalName implements Action<null, null> {
  constructor(private readonly _data: UpdatePlantingAdditionalNameParam, public actionId = v4()) {}

  get entityIds() {
    return [this._data.id];
  }

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  reverse(state: TrackedMapState) {
    return null;
  }

  apply(state: TrackedMapState): TrackedMapState {
    const objects_updated = state.layers.plants.objects.map((object) => ({
      ...object,
      additionalName:
        object.id === this._data.id ? this._data.additionalName : object.additionalName,
    }));

    return {
      ...state,
      layers: {
        ...state.layers,
        plants: {
          ...state.layers.plants,
          objects: objects_updated,
        },
      },
    };
  }

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(mapId: number): Promise<null> {
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Promise<null>(() => {});
  }
}

/**
 * Filters an array of objects by their IDs.
 *
 * @param array - The array of objects to filter.
 * @param ids - The array of IDs to filter by.
 * @returns An array of objects that have IDs matching the provided IDs.
 */
function filterByIds<T extends { id: unknown }>(array: T[], ids: unknown[]): T[] {
  return array.filter((e) => ids.includes(e.id));
}
