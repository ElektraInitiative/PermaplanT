/**
 * @module this module contains actions for the drawing layer.
 */
import { v4 } from 'uuid';
import { DrawingDto } from '@/api_types/definitions';
import { createDrawing, deleteDrawing, updateDrawing } from '../../api/drawingApi';
import useMapStore from '../../store/MapStore';
import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { filterVisibleObjects } from '../../utils/filterVisibleObjects';

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
    return new DeleteDrawingAction(this._data, this.actionId);
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

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof createDrawing>>> {
    return createDrawing(mapId, this.actionId, [this._data]);
  }
}

export class DeleteDrawingAction
  implements Action<boolean, Awaited<ReturnType<typeof createDrawing>>>
{
  constructor(
    private readonly _data: Omit<DrawingDto, 'userId' | 'actionId'>,
    public actionId = v4(),
  ) {}

  get entityIds() {
    return [this._data.id];
  }

  async execute(mapId: number): Promise<boolean> {
    return deleteDrawing(mapId, this.actionId, [this._data]);
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

export class UpdateDrawingAction
  implements
    Action<Awaited<ReturnType<typeof updateDrawing>>, Awaited<ReturnType<typeof updateDrawing>>>
{
  private readonly _ids: Array<string>;

  get entityIds() {
    return this._ids;
  }

  constructor(
    private readonly _data: Omit<DrawingDto, 'userId' | 'actionId'>[],
    public actionId = v4(),
  ) {
    this._ids = _data.map((d) => d.id);
  }

  reverse(state: TrackedMapState) {
    const drawings = state.layers.drawing.objects.filter((obj) => this._ids.includes(obj.id));
    if (!drawings.length) {
      return null;
    }

    return new UpdateDrawingAction(drawings, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updateDrawings = (drawings: Array<DrawingDto>) => {
      return drawings.map((drawing) => {
        if (this._ids.includes(drawing.id)) {
          const updatedDrawing = JSON.parse(
            JSON.stringify(this._data.find((d) => d.id === drawing.id)),
          );
          if (updatedDrawing) {
            return {
              ...updatedDrawing,
              properties: {
                ...updatedDrawing.properties,
              },
            };
          }
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

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof updateDrawing>>> {
    return await updateDrawing(mapId, this.actionId, this._data);
  }
}

export class UpdateAddDateDrawingAction
  implements
    Action<Awaited<ReturnType<typeof updateDrawing>>, Awaited<ReturnType<typeof updateDrawing>>>
{
  private readonly _ids: Array<string>;

  get entityIds() {
    return this._ids;
  }

  constructor(
    private readonly _data: Omit<DrawingDto, 'userId' | 'actionId'>[],
    public actionId = v4(),
  ) {
    this._ids = _data.map((d) => d.id);
  }

  reverse(state: TrackedMapState) {
    const drawings = state.layers.drawing.objects.filter((obj) => this._ids.includes(obj.id));

    if (!drawings.length) {
      return null;
    }

    return new UpdateDrawingAction(drawings, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updateDrawings = (drawings: Array<DrawingDto>) => {
      return drawings.map((drawing) => {
        if (this._ids.includes(drawing.id)) {
          const updatedDrawing = this._data.find((d) => d.id === drawing.id);

          if (updatedDrawing) {
            return {
              ...drawing,
              ...updatedDrawing,
            };
          }
        }

        return drawing;
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

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof updateDrawing>>> {
    return await updateDrawing(mapId, this.actionId, this._data);
  }
}

export class UpdateRemoveDateDrawingAction
  implements
    Action<Awaited<ReturnType<typeof updateDrawing>>, Awaited<ReturnType<typeof updateDrawing>>>
{
  private readonly _ids: Array<string>;

  get entityIds() {
    return this._ids;
  }

  constructor(
    private readonly _data: Omit<DrawingDto, 'userId' | 'actionId'>[],
    public actionId = v4(),
  ) {
    this._ids = _data.map((d) => d.id);
  }

  reverse(state: TrackedMapState) {
    const drawings = state.layers.drawing.objects.filter((obj) => this._ids.includes(obj.id));

    if (!drawings.length) {
      return null;
    }

    return new UpdateDrawingAction(drawings, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updateDrawings = (drawings: Array<DrawingDto>) => {
      return drawings.map((drawing) => {
        if (this._ids.includes(drawing.id)) {
          const updatedDrawing = this._data.find((d) => d.id === drawing.id);

          if (updatedDrawing) {
            return {
              ...drawing,
              ...updatedDrawing,
            };
          }
        }

        return drawing;
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

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof updateDrawing>>> {
    return await updateDrawing(mapId, this.actionId, this._data);
  }
}
