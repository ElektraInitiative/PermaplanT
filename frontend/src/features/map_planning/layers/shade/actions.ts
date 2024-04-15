import { v4 } from 'uuid';
import {
  CreateShadingActionPayload,
  DeleteShadingActionPayload,
  UpdateShadingActionPayload,
  UpdateShadingAddDateActionPayload,
  UpdateShadingRemoveDateActionPayload,
} from '@/api_types/definitions';
import {
  createShading,
  deleteShading,
  updateShadingAddDate,
  updateShadingContent,
  updateShadingRemoveDate,
} from '@/features/map_planning/api/shadingApi';
import useMapStore from '@/features/map_planning/store/MapStore';
import { Action, TrackedMapState } from '@/features/map_planning/store/MapStoreTypes';
import { filterVisibleObjects } from '@/features/map_planning/utils/filterVisibleObjects';
import { filterByIds } from '@/features/map_planning/utils/layer-utils';

export class CreateShadingAction
  implements Action<Awaited<ReturnType<typeof createShading>>, boolean>
{
  private readonly _ids: string[];

  get entityIds() {
    return this._ids;
  }

  constructor(private readonly _data: CreateShadingActionPayload[], public actionId = v4()) {
    this._ids = _data.map(({ id }) => id);
  }

  reverse() {
    return new DeleteShadingAction(
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
        shade: {
          ...state.layers.shade,
          objects: filterVisibleObjects(
            [...state.layers.shade.objects, ...this._data],
            timelineDate,
          ),
          loadedObjects: [...state.layers.shade.loadedObjects, ...this._data],
        },
      },
    };
  }

  async execute(mapId: number) {
    return createShading(mapId, this.actionId, this._data);
  }
}

export class DeleteShadingAction
  implements Action<boolean, Awaited<ReturnType<typeof createShading>>>
{
  private readonly _ids: string[];

  constructor(private readonly _data: DeleteShadingActionPayload[], public actionId = v4()) {
    this._ids = this._data.map(({ id }) => id);
  }

  get entityIds() {
    return this._ids;
  }

  async execute(mapId: number): Promise<boolean> {
    return deleteShading(mapId, this.actionId, this._data);
  }

  reverse(state: TrackedMapState) {
    const shadings = filterByIds(state.layers.shade.loadedObjects, this._ids);

    if (!shadings.length) {
      return null;
    }

    return new CreateShadingAction(shadings, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        shade: {
          ...state.layers.shade,
          objects: state.layers.shade.objects.filter((p) => !this._ids.includes(p.id)),
          loadedObjects: state.layers.shade.loadedObjects.filter((p) => !this._ids.includes(p.id)),
        },
      },
    };
  }
}

export class UpdateShadingAction
  implements
    Action<
      Awaited<ReturnType<typeof updateShadingContent>>,
      Awaited<ReturnType<typeof updateShadingContent>>
    >
{
  private readonly _ids: string[];

  get entityIds() {
    return this._ids;
  }

  constructor(private readonly _data: UpdateShadingActionPayload[], public actionId = v4()) {
    this._ids = _data.map((d) => d.id);
  }

  reverse(state: TrackedMapState) {
    const shadings = filterByIds(state.layers.shade.loadedObjects, this._ids);

    if (!shadings) {
      return null;
    }

    return new UpdateShadingAction(shadings, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updatedShadings = useMapStore
      .getState()
      .trackedState.layers.shade.loadedObjects.map((shading, idx) => {
        if (this._ids.find((id) => id == shading.id)) {
          return {
            ...shading,
            shade: this._data[idx].shade ?? shading.shade,
            geometry: this._data[idx].geometry ?? shading.geometry,
          };
        }

        return shading;
      });

    const timelineDate = useMapStore.getState().untrackedState.timelineDate;

    return {
      ...state,
      layers: {
        ...state.layers,
        shade: {
          ...state.layers.shade,
          objects: filterVisibleObjects(updatedShadings, timelineDate),
          loadedObjects: updatedShadings,
        },
      },
    };
  }

  async execute(mapId: number) {
    return updateShadingContent(mapId, this.actionId, this._data);
  }
}

export class UpdateShadingAddDateAction
  implements
    Action<
      Awaited<ReturnType<typeof updateShadingContent>>,
      Awaited<ReturnType<typeof updateShadingContent>>
    >
{
  private readonly _ids: string[];

  get entityIds() {
    return this._ids;
  }

  constructor(private readonly _data: UpdateShadingAddDateActionPayload[], public actionId = v4()) {
    this._ids = this._data.map(({ id }) => id);
  }

  reverse(state: TrackedMapState) {
    const shadings = filterByIds(state.layers.shade.loadedObjects, this._ids);

    if (!shadings) {
      return null;
    }

    return new UpdateShadingAddDateAction(
      shadings.map((s) => ({
        id: s.id,
        addDate: s.addDate,
      })),
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updatedShadings = useMapStore
      .getState()
      .trackedState.layers.shade.loadedObjects.map((shading, idx) => {
        if (this._ids.includes(shading.id)) {
          return {
            ...shading,
            addDate: this._data[idx].addDate,
          };
        }

        return shading;
      });

    const timelineDate = useMapStore.getState().untrackedState.timelineDate;

    return {
      ...state,
      layers: {
        ...state.layers,
        shade: {
          ...state.layers.shade,
          objects: filterVisibleObjects(updatedShadings, timelineDate),
          loadedObjects: updatedShadings,
        },
      },
    };
  }

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof updateShadingContent>>> {
    return updateShadingAddDate(mapId, this.actionId, this._data);
  }
}

export class UpdateShadingRemoveDateAction
  implements
    Action<
      Awaited<ReturnType<typeof updateShadingRemoveDate>>,
      Awaited<ReturnType<typeof updateShadingRemoveDate>>
    >
{
  private readonly _ids: string[];

  get entityIds() {
    return this._ids;
  }

  constructor(
    private readonly _data: UpdateShadingRemoveDateActionPayload[],
    public actionId = v4(),
  ) {
    this._ids = this._data.map(({ id }) => id);
  }

  reverse(state: TrackedMapState) {
    const shadings = filterByIds(state.layers.shade.loadedObjects, this._ids);

    if (!shadings) {
      return null;
    }

    return new UpdateShadingAddDateAction(
      shadings.map((s) => ({
        id: s.id,
        addDate: s.addDate,
      })),
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updatedShadings = useMapStore
      .getState()
      .trackedState.layers.shade.loadedObjects.map((shading, idx) => {
        if (this._ids.includes(shading.id)) {
          return {
            ...shading,
            removeDate: this._data[idx].removeDate,
          };
        }

        return shading;
      });

    const timelineDate = useMapStore.getState().untrackedState.timelineDate;

    return {
      ...state,
      layers: {
        ...state.layers,
        shade: {
          ...state.layers.shade,
          objects: filterVisibleObjects(updatedShadings, timelineDate),
          loadedObjects: updatedShadings,
        },
      },
    };
  }

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof updateShadingContent>>> {
    return updateShadingAddDate(mapId, this.actionId, this._data);
  }
}
