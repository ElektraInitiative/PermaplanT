/**
 * @module this module contains actions for the plant layer.
 */
import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { createDrawing } from './api/createDrawing';
import { DeleteDrawingDto, deleteDrawing } from './api/deleteDrawing';
import { DrawingDto } from './types';
import { v4 } from 'uuid';

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

    return {
      ...state,
      layers: {
        ...state.layers,
        drawing: {
          ...state.layers.drawing,
          objects: [...state.layers.drawing.objects, { ...newDrawing }],
        },
      },
    };
  }

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
          objects: state.layers.drawing.objects.filter((r) => r.id !== this._data.id),
        },
      },
    };
  }
}
