import { v4 } from 'uuid';
import {
  CreateShadingActionPayload,
  DeleteShadingActionPayload,
  UpdateShadingActionPayload,
  UpdateShadingAddDateActionPayload,
  UpdateShadingRemoveDateActionPayload,
} from '@/api_types/definitions';
import { createShading } from '@/features/map_planning/layers/shade/api/createShading';
import { deleteShading } from '@/features/map_planning/layers/shade/api/deleteShading';
import { updateShading } from '@/features/map_planning/layers/shade/api/updateShading';
import useMapStore from '@/features/map_planning/store/MapStore';
import { Action, TrackedMapState } from '@/features/map_planning/store/MapStoreTypes';
import { filterVisibleObjects } from '@/features/map_planning/utils/filterVisibleObjects';

export class CreateShadingAction
  implements Action<Awaited<ReturnType<typeof createShading>>, boolean>
{
  private readonly _id: string;

  get entityIds() {
    return [this._id];
  }

  constructor(
    private readonly _data: Omit<CreateShadingActionPayload, 'userId' | 'actionId'>,
    public actionId = v4(),
  ) {
    this._id = _data.id;
  }

  reverse() {
    return new DeleteShadingAction(
      {
        id: this._id,
      },
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const newShading = {
      ...this._data,
      id: this._id,
    };

    const timelineDate = useMapStore.getState().untrackedState.timelineDate;

    return {
      ...state,
      layers: {
        ...state.layers,
        shade: {
          ...state.layers.shade,
          objects: filterVisibleObjects(
            [...state.layers.shade.objects, { ...newShading }],
            timelineDate,
          ),
          loadedObjects: [...state.layers.shade.loadedObjects, { ...newShading }],
        },
      },
    };
  }

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof createShading>>> {
    return createShading(mapId, {
      ...this._data,
      id: this._id,
      actionId: this.actionId,
    });
  }
}

export class DeleteShadingAction
  implements Action<boolean, Awaited<ReturnType<typeof createShading>>>
{
  constructor(
    private readonly _data: Omit<DeleteShadingActionPayload, 'userId' | 'actionId'>,
    public actionId = v4(),
  ) {}

  get entityIds() {
    return [this._data.id];
  }

  async execute(mapId: number): Promise<boolean> {
    return deleteShading(mapId, this._data.id, {
      actionId: this.actionId,
    });
  }

  reverse(state: TrackedMapState) {
    const shading = state.layers.shade.loadedObjects.find((obj) => obj.id === this._data.id);

    if (!shading) {
      return null;
    }

    return new CreateShadingAction(shading, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        shade: {
          ...state.layers.shade,
          objects: state.layers.shade.objects.filter((p) => p.id !== this._data.id),
          loadedObjects: state.layers.shade.loadedObjects.filter((p) => p.id !== this._data.id),
        },
      },
    };
  }
}

export class UpdateShadingAction
  implements
    Action<Awaited<ReturnType<typeof updateShading>>, Awaited<ReturnType<typeof updateShading>>>
{
  get entityIds() {
    return [this._data.id];
  }

  constructor(
    private readonly _data: Omit<UpdateShadingActionPayload, 'userId' | 'actionId'>,
    public actionId = v4(),
  ) {}

  reverse(state: TrackedMapState) {
    const shading = state.layers.shade.loadedObjects.find((obj) => obj.id === this._data.id);

    if (!shading) {
      return null;
    }

    return new UpdateShadingAction(shading, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updatedShadings = useMapStore
      .getState()
      .trackedState.layers.shade.loadedObjects.map((shading) => {
        if (shading.id === this._data.id) {
          return {
            ...shading,
            shade: this._data.shade ?? shading.shade,
            geometry: this._data.geometry ?? shading.geometry,
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

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof updateShading>>> {
    return updateShading(mapId, this._data.id, {
      type: 'Update',
      content: {
        ...this._data,
        action_id: this.actionId,
      },
    });
  }
}

export class UpdateShadingAddDateAction
  implements
    Action<Awaited<ReturnType<typeof updateShading>>, Awaited<ReturnType<typeof updateShading>>>
{
  get entityIds() {
    return [this._data.id];
  }

  constructor(
    private readonly _data: Omit<UpdateShadingAddDateActionPayload, 'userId' | 'actionId'>,
    public actionId = v4(),
  ) {}

  reverse(state: TrackedMapState) {
    const shading = state.layers.shade.loadedObjects.find((obj) => obj.id === this._data.id);

    if (!shading) {
      return null;
    }

    return new UpdateShadingAddDateAction(shading, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updatedShadings = useMapStore
      .getState()
      .trackedState.layers.shade.loadedObjects.map((shading) => {
        if (shading.id === this._data.id) {
          return {
            ...shading,
            addDate: this._data.addDate,
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

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof updateShading>>> {
    return updateShading(mapId, this._data.id, {
      type: 'UpdateAddDate',
      content: {
        ...this._data,
        actionId: this.actionId,
      },
    });
  }
}

export class UpdateShadingRemoveDateAction
  implements
    Action<Awaited<ReturnType<typeof updateShading>>, Awaited<ReturnType<typeof updateShading>>>
{
  get entityIds() {
    return [this._data.id];
  }

  constructor(
    private readonly _data: Omit<UpdateShadingRemoveDateActionPayload, 'userId' | 'actionId'>,
    public actionId = v4(),
  ) {}

  reverse(state: TrackedMapState) {
    const shading = state.layers.shade.loadedObjects.find((obj) => obj.id === this._data.id);

    if (!shading) {
      return null;
    }

    return new UpdateShadingRemoveDateAction(shading, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updatedShadings = useMapStore
      .getState()
      .trackedState.layers.shade.loadedObjects.map((shading) => {
        if (shading.id === this._data.id) {
          return {
            ...shading,
            removeDate: this._data.removeDate,
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

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof updateShading>>> {
    return updateShading(mapId, this._data.id, {
      type: 'UpdateRemoveDate',
      content: {
        ...this._data,
        actionId: this.actionId,
      },
    });
  }
}
