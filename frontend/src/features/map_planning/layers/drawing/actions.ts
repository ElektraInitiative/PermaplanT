/**
 * @module this module contains actions for the drawing layer.
 */
import { v4 } from 'uuid';
import useMapStore from '../../store/MapStore';
import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { filterVisibleObjects } from '../../utils/filterVisibleObjects';
import { createDrawing } from './api/createDrawing';
import { DeleteDrawingDto, deleteDrawing } from './api/deleteDrawing';
import { moveDrawing } from './api/moveDrawing';
import { updateAddDateDrawing } from './api/updateAddDateDrawing';
import { updateColorDrawing } from './api/updateColorDrawing';
import { updatePropertiesDrawing } from './api/updatePropertiesDrawing';
import { updateRemoveDateDrawing } from './api/updateRemoveDateDrawing';
import { updateStrokeWidthDrawing } from './api/updateStrokeWidthDrawing';
import {
  DrawingDto,
  MoveDrawingActionPayload,
  TransformDrawingActionPayload,
  UpdateDrawingAddDateActionPayload,
  UpdateDrawingColorActionPayload,
  UpdateDrawingPropertiesActionPayload,
  UpdateDrawingRemoveDateActionPayload,
  UpdateDrawingStrokeWidthActionPayload,
} from './types';

export class CreateDrawingAction
  implements Action<Awaited<ReturnType<typeof createDrawing>>, boolean>
{
  private readonly _id: string;

  get entityIds() {
    return [this._id];
  }

  constructor(
    private readonly _data: Omit<DrawingDto, 'userId' | 'actionId'>,
    public actionId = v4(),
  ) {
    this._id = _data.id;
  }

  reverse() {
    return new DeleteDrawingAction(
      {
        id: this._id,
      },
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const newDrawing: DrawingDto = {
      ...this._data,
      id: this._id,
    };

    const timelineDate = useMapStore.getState().untrackedState.timelineDate;

    return {
      ...state,
      layers: {
        ...state.layers,
        drawing: {
          ...state.layers.drawing,
          objects: filterVisibleObjects(
            [...state.layers.drawing.objects, { ...newDrawing }],
            timelineDate,
          ),
          loadedObjects: [...state.layers.drawing.loadedObjects, { ...newDrawing }],
        },
      },
    };
  }

  //TODO #1123 - implement funtion to call backend
  async execute(mapId: number): Promise<Awaited<ReturnType<typeof createDrawing>>> {
    return createDrawing(mapId, {
      ...this._data,
    });
  }
}

export class DeleteDrawingAction
  implements Action<boolean, Awaited<ReturnType<typeof createDrawing>>>
{
  constructor(
    private readonly _data: Omit<DeleteDrawingDto, 'userId' | 'actionId'>,
    public actionId = v4(),
  ) {}

  get entityIds() {
    return [this._data.id];
  }

  async execute(): Promise<boolean> {
    return deleteDrawing();
  }

  reverse(state: TrackedMapState) {
    const drawing = state.layers.drawing.objects.find((obj) => obj.id === this._data.id);

    if (!drawing) {
      return null;
    }

    return new CreateDrawingAction(drawing, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        drawing: {
          ...state.layers.drawing,
          objects: state.layers.drawing.objects.filter((p) => p.id !== this._data.id),
          loadedObjects: state.layers.drawing.loadedObjects.filter((p) => p.id !== this._data.id),
        },
      },
    };
  }
}

export class MoveDrawingAction
  implements
    Action<Awaited<ReturnType<typeof moveDrawing>>[], Awaited<ReturnType<typeof moveDrawing>>[]>
{
  private readonly _ids: Array<string>;

  get entityIds() {
    return this._ids;
  }

  constructor(
    private readonly _data: Omit<MoveDrawingActionPayload, 'userId' | 'actionId'>[],
    public actionId = v4(),
  ) {
    this._ids = _data.map((d) => d.id);
  }

  reverse(state: TrackedMapState) {
    console.log(state.layers.drawing.objects);
    console.log(this._ids);
    const drawings = state.layers.drawing.objects.filter((obj) => this._ids.includes(obj.id));

    if (!drawings.length) {
      return null;
    }

    return new MoveDrawingAction(
      drawings.map((p) => ({ id: p.id, x: p.x, y: p.y })),
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updateDrawings = (drawings: Array<DrawingDto>) => {
      return drawings.map((drawing) => {
        if (this._ids.includes(drawing.id)) {
          return {
            ...drawing,
            x: this._data.find((d) => drawing.id === d.id)?.x ?? drawing.x,
            y: this._data.find((d) => drawing.id === d.id)?.y ?? drawing.y,
          };
        }

        return drawing;
      });
    };

    console.log('moveDrawing');

    return {
      ...state,
      layers: {
        ...state.layers,
        drawing: {
          ...state.layers.drawing,
          objects: updateDrawings(state.layers.drawing.objects),
          loadedObjects: updateDrawings(state.layers.drawing.loadedObjects),
        },
      },
    };
  }

  //TODO #1123 - implement funtion to call backend
  execute(): Promise<boolean[]> {
    const tasks = this._data.map(() => moveDrawing());
    return Promise.all(tasks);
  }
}

export class TransformDrawingAction
  implements
    Action<Awaited<ReturnType<typeof moveDrawing>>[], Awaited<ReturnType<typeof moveDrawing>>[]>
{
  private readonly _ids: Array<string>;

  get entityIds() {
    return this._ids;
  }

  constructor(
    private readonly _data: Omit<TransformDrawingActionPayload, 'userId' | 'actionId'>[],
    public actionId = v4(),
  ) {
    this._ids = _data.map((d) => d.id);
  }

  reverse(state: TrackedMapState) {
    const drawings = state.layers.drawing.objects.filter((obj) => this._ids.includes(obj.id));

    if (!drawings.length) {
      return null;
    }

    return new TransformDrawingAction(
      drawings.map((p) => ({
        id: p.id,
        x: p.x,
        y: p.y,
        scaleX: p.scaleX,
        scaleY: p.scaleY,
        rotation: p.rotation,
      })),
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    console.log('moveDrawing');

    const updateDrawings = (drawings: Array<DrawingDto>) => {
      return drawings.map((drawing) => {
        if (this._ids.includes(drawing.id)) {
          return {
            ...drawing,
            x: this._data.find((d) => d.id === drawing.id)?.x ?? drawing.x,
            y: this._data.find((d) => d.id === drawing.id)?.y ?? drawing.y,
            scaleX: this._data.find((d) => d.id === drawing.id)?.scaleX ?? drawing.scaleX,
            scaleY: this._data.find((d) => d.id === drawing.id)?.scaleY ?? drawing.scaleY,
            rotation: this._data.find((d) => d.id === drawing.id)?.rotation ?? drawing.rotation,
          };
        }

        return drawing;
      });
    };

    return {
      ...state,
      layers: {
        ...state.layers,
        drawing: {
          ...state.layers.drawing,
          objects: updateDrawings(state.layers.drawing.objects),
          loadedObjects: updateDrawings(state.layers.drawing.loadedObjects),
        },
      },
    };
  }

  //TODO #1123 - implement funtion to call backend
  execute(): Promise<boolean[]> {
    const tasks = this._data.map(() => moveDrawing());
    return Promise.all(tasks);
  }
}

export class UpdateAddDateDrawingAction
  implements
    Action<
      Awaited<ReturnType<typeof updateAddDateDrawing>>,
      Awaited<ReturnType<typeof updateAddDateDrawing>>
    >
{
  constructor(
    private readonly _data: Omit<UpdateDrawingAddDateActionPayload, 'userId' | 'actionId'>,
    public actionId = v4(),
  ) {}

  get entityIds() {
    return [this._data.id];
  }

  reverse(state: TrackedMapState) {
    const plant = state.layers.drawing.loadedObjects.find((obj) => obj.id === this._data.id);

    if (!plant) {
      return null;
    }

    return new UpdateAddDateDrawingAction(
      {
        id: plant.id,
        addDate: plant.addDate,
      },
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updateDrawings = (drawings: Array<DrawingDto>) => {
      return drawings.map((p) => {
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
        drawing: {
          ...state.layers.drawing,
          objects: filterVisibleObjects(
            updateDrawings(state.layers.drawing.loadedObjects),
            timelineDate,
          ),
          loadedObjects: updateDrawings(state.layers.drawing.loadedObjects),
        },
      },
    };
  }

  //TODO #1123 - implement funtion to call backend
  execute(): Promise<boolean> {
    return updateAddDateDrawing();
  }
}

export class UpdateRemoveDateDrawingAction
  implements
    Action<
      Awaited<ReturnType<typeof updateRemoveDateDrawing>>,
      Awaited<ReturnType<typeof updateRemoveDateDrawing>>
    >
{
  constructor(
    private readonly _data: Omit<UpdateDrawingRemoveDateActionPayload, 'userId' | 'actionId'>,
    public actionId = v4(),
  ) {}

  get entityIds() {
    return [this._data.id];
  }

  reverse(state: TrackedMapState) {
    const plant = state.layers.drawing.loadedObjects.find((obj) => obj.id === this._data.id);

    if (!plant) {
      return null;
    }

    return new UpdateRemoveDateDrawingAction(
      {
        id: plant.id,
        removeDate: plant.removeDate,
      },
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updateDrawings = (drawings: Array<DrawingDto>) => {
      return drawings.map((p) => {
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
        drawing: {
          ...state.layers.drawing,
          objects: filterVisibleObjects(
            updateDrawings(state.layers.drawing.loadedObjects),
            timelineDate,
          ),
          loadedObjects: updateDrawings(state.layers.drawing.loadedObjects),
        },
      },
    };
  }

  //TODO #1123 - implement funtion to call backend
  execute(): Promise<boolean> {
    return updateRemoveDateDrawing();
  }
}

export class UpdatePropertiesDrawingAction
  implements
    Action<
      Awaited<ReturnType<typeof updatePropertiesDrawing>>,
      Awaited<ReturnType<typeof updatePropertiesDrawing>>
    >
{
  constructor(
    private readonly _data: Omit<UpdateDrawingPropertiesActionPayload, 'userId' | 'actionId'>,
    public actionId = v4(),
  ) {}

  get entityIds() {
    return [this._data.id];
  }

  reverse(state: TrackedMapState) {
    const drawing = state.layers.drawing.loadedObjects.find((obj) => obj.id === this._data.id);

    if (!drawing) {
      return null;
    }

    return new UpdatePropertiesDrawingAction(
      {
        id: drawing.id,
        properties: drawing.properties,
      },
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updateDrawings = (drawings: Array<DrawingDto>) => {
      return drawings.map((p) => {
        if (p.id === this._data.id) {
          return {
            ...p,
            properties: this._data.properties,
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
        drawing: {
          ...state.layers.drawing,
          objects: filterVisibleObjects(
            updateDrawings(state.layers.drawing.loadedObjects),
            timelineDate,
          ),
          loadedObjects: updateDrawings(state.layers.drawing.loadedObjects),
        },
      },
    };
  }

  //TODO #1123 - implement funtion to call backend
  execute(): Promise<boolean> {
    return updatePropertiesDrawing();
  }
}

export class UpdateColorDrawingAction
  implements
    Action<
      Awaited<ReturnType<typeof updateColorDrawing>>,
      Awaited<ReturnType<typeof updateColorDrawing>>
    >
{
  constructor(
    private readonly _data: Omit<UpdateDrawingColorActionPayload, 'userId' | 'actionId'>,
    public actionId = v4(),
  ) {}

  get entityIds() {
    return [this._data.id];
  }

  reverse(state: TrackedMapState) {
    const drawing = state.layers.drawing.loadedObjects.find((obj) => obj.id === this._data.id);

    if (!drawing) {
      return null;
    }

    return new UpdateColorDrawingAction(
      {
        id: drawing.id,
        color: drawing.color,
      },
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updateDrawings = (drawings: Array<DrawingDto>) => {
      return drawings.map((p) => {
        if (p.id === this._data.id) {
          return {
            ...p,
            color: this._data.color,
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
        drawing: {
          ...state.layers.drawing,
          objects: filterVisibleObjects(
            updateDrawings(state.layers.drawing.loadedObjects),
            timelineDate,
          ),
          loadedObjects: updateDrawings(state.layers.drawing.loadedObjects),
        },
      },
    };
  }

  //TODO #1123 - implement funtion to call backend
  execute(): Promise<boolean> {
    return updateColorDrawing();
  }
}

export class UpdateStrokeWidthDrawingAction
  implements
    Action<
      Awaited<ReturnType<typeof updateStrokeWidthDrawing>>,
      Awaited<ReturnType<typeof updateStrokeWidthDrawing>>
    >
{
  constructor(
    private readonly _data: Omit<UpdateDrawingStrokeWidthActionPayload, 'userId' | 'actionId'>,
    public actionId = v4(),
  ) {}

  get entityIds() {
    return [this._data.id];
  }

  reverse(state: TrackedMapState) {
    const drawing = state.layers.drawing.loadedObjects.find((obj) => obj.id === this._data.id);

    if (!drawing) {
      return null;
    }

    return new UpdateStrokeWidthDrawingAction(
      {
        id: drawing.id,
        strokeWidth: drawing.strokeWidth,
      },
      this.actionId,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updateDrawings = (drawings: Array<DrawingDto>) => {
      return drawings.map((p) => {
        if (p.id === this._data.id) {
          return {
            ...p,
            strokeWidth: this._data.strokeWidth,
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
        drawing: {
          ...state.layers.drawing,
          objects: filterVisibleObjects(
            updateDrawings(state.layers.drawing.loadedObjects),
            timelineDate,
          ),
          loadedObjects: updateDrawings(state.layers.drawing.loadedObjects),
        },
      },
    };
  }

  //TODO #1123 - implement funtion to call backend
  execute(): Promise<boolean> {
    return updateColorDrawing();
  }
}
