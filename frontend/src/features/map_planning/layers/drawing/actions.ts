/**
 * @module this module contains actions for the drawing layer.
 */
import { v4 } from 'uuid';
import {
  DrawingDto,
  UpdateAddDateActionPayload,
  UpdateRemoveDateActionPayload,
} from '@/api_types/definitions';
import updateDrawingAddDate, {
  createDrawing,
  deleteDrawing,
  updateDrawing,
  updateDrawingRemoveDate,
} from '../../api/drawingApi';
import useMapStore from '../../store/MapStore';
import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { filterVisibleObjects } from '../../utils/filterVisibleObjects';

export class CreateDrawingAction
  implements Action<Awaited<ReturnType<typeof createDrawing>>, boolean>
{
  private readonly _ids: Array<string>;

  get entityIds() {
    return this._ids;
  }

  constructor(private readonly _data: DrawingDto[], public actionId = v4()) {
    this._ids = _data.map((d) => d.id);
  }

  reverse() {
    return new DeleteDrawingAction(this._ids, this.actionId);
  }

  apply(state: TrackedMapState): TrackedMapState {
    const newDrawings = this._data.map((newDrawing) => {
      return {
        ...newDrawing,
        properties: {
          ...newDrawing.properties,
        },
      };
    });

    const timelineDate = useMapStore.getState().untrackedState.timelineDate;

    return {
      ...state,
      layers: {
        ...state.layers,
        drawing: {
          ...state.layers.drawing,
          objects: filterVisibleObjects(
            [...state.layers.drawing.objects, ...newDrawings],
            timelineDate,
          ),
          loadedObjects: [...state.layers.drawing.loadedObjects, ...newDrawings],
        },
      },
    };
  }

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof createDrawing>>> {
    return createDrawing(mapId, this.actionId, this._data);
  }
}

export class DeleteDrawingAction
  implements Action<boolean, Awaited<ReturnType<typeof createDrawing>>>
{
  constructor(private readonly _data: string[], public actionId = v4()) {}

  get entityIds() {
    return this._data;
  }

  async execute(mapId: number): Promise<boolean> {
    return deleteDrawing(mapId, this.actionId, this._data);
  }

  reverse(state: TrackedMapState) {
    const drawings = state.layers.drawing.objects.filter((obj) => this._data.includes(obj.id));

    if (!drawings || drawings.length < 1) {
      return null;
    }

    return new CreateDrawingAction(drawings, this.actionId);
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
          const updatedDrawing = this._data.find((d) => d.id === drawing.id);

          if (updatedDrawing) {
            return {
              ...updatedDrawing,
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

export class UpdateDrawingAddDateAction
  implements
    Action<
      Awaited<ReturnType<typeof updateDrawingAddDate>>,
      Awaited<ReturnType<typeof updateDrawingAddDate>>
    >
{
  private readonly _ids: Array<string>;

  get entityIds() {
    return this._ids;
  }

  constructor(private readonly _data: UpdateAddDateActionPayload[], public actionId = v4()) {
    this._ids = _data.map((d) => d.id);
  }

  reverse(state: TrackedMapState) {
    const drawings = state.layers.drawing.objects.filter((obj) => this._ids.includes(obj.id));

    if (!drawings.length) {
      return null;
    }

    return new UpdateDrawingAddDateAction(drawings.map((d) => ({ ...d, addDate: d.addDate })));
  }

  apply(state: TrackedMapState): TrackedMapState {
    const updateDrawings = (drawings: Array<DrawingDto>) => {
      return drawings.map((drawing) => {
        if (this._ids.includes(drawing.id)) {
          return {
            ...drawing,
            addDate: this._data.find((d) => d.id === drawing.id)?.addDate ?? drawing.addDate,
          };
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

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof updateDrawingAddDate>>> {
    return await updateDrawingAddDate(mapId, this.actionId, this._data);
  }
}

export class UpdateDrawingRemoveDateAction
  implements
    Action<
      Awaited<ReturnType<typeof updateDrawingRemoveDate>>,
      Awaited<ReturnType<typeof updateDrawingRemoveDate>>
    >
{
  private readonly _ids: Array<string>;

  get entityIds() {
    return this._ids;
  }

  constructor(
    private readonly _data: Omit<UpdateRemoveDateActionPayload, 'userId' | 'actionId'>[],
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

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof updateDrawingRemoveDate>>> {
    return await updateDrawingRemoveDate(mapId, this.actionId, this._data);
  }
}
