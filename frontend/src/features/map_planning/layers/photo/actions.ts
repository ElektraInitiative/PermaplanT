/**
 * @module this module contains actions for the photo layer.
 */
import { createPhoto } from '../../api/createPhoto';
import { deletePhoto } from '../../api/deletePhoto';
import { movePhoto } from '../../api/movePhoto';
import { transformPhoto } from '../../api/transformPhoto';
import { Action, PhotoDto, TrackedMapState } from '../../store/MapStoreTypes';

export class CreatePhotoAction
  implements Action<Awaited<ReturnType<typeof createPhoto>>, boolean>
{
  private readonly _id: string;

  constructor(private readonly _data: PhotoDto) {
    this._id = _data.id;
  }

  reverse() {
    return new DeletePhotoAction(this._id);
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        photo: {
          ...state.layers.photo,
          objects: [
            ...state.layers.photo.objects,
            {
              ...this._data,
              id: this._id,
            },
          ],
        },
      },
    };
  }

  async execute(mapId: number): Promise<Awaited<ReturnType<typeof createPhoto>>> {
    return createPhoto(mapId, {
      ...this._data,
      id: this._id,
    });
  }
}

export class DeletePhotoAction
  implements Action<boolean, Awaited<ReturnType<typeof createPhoto>>>
{
  constructor(private readonly _id: string) {}

  async execute(mapId: number): Promise<boolean> {
    return deletePhoto(mapId, this._id);
  }

  reverse(state: TrackedMapState) {
    const photo = state.layers.photo.objects.find((obj) => obj.id === this._id);

    if (!photo) {
      return null;
    }

    return new CreatePhotoAction(photo);
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        photo: {
          ...state.layers.photo,
          objects: state.layers.photo.objects.filter((p) => p.id !== this._id),
        },
      },
    };
  }
}

export class MovePhotoAction
  implements
    Action<Awaited<ReturnType<typeof movePhoto>>[], Awaited<ReturnType<typeof movePhoto>>[]>
{
  private readonly _ids: Array<string>;

  constructor(private readonly _data: Array<Pick<PhotoDto, 'x' | 'y' | 'id'>>) {
    this._ids = _data.map((d) => d.id);
  }

  reverse(state: TrackedMapState) {
    const photos = state.layers.plants.objects.filter((obj) => this._ids.includes(obj.id));

    if (!photos.length) {
      return null;
    }

    return new MovePhotoAction(photos.map((p) => ({ id: p.id, x: p.x, y: p.y })));
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        photo: {
          ...state.layers.photo,
          objects: state.layers.photo.objects.map((p) => {
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

  execute(mapId: number): Promise<PhotoDto[]> {
    const tasks = this._data.map((d) =>
      movePhoto(mapId, d.id, {
        x: d.x,
        y: d.y,
      }),
    );

    return Promise.all(tasks);
  }
}

export class TransformPhotoAction
  implements
    Action<Awaited<ReturnType<typeof movePhoto>>[], Awaited<ReturnType<typeof movePhoto>>[]>
{
  private readonly _ids: Array<string>;

  constructor(
    private readonly _data: Array<
      Pick<PhotoDto, 'x' | 'y' | 'id' | 'scaleX' | 'scaleY' | 'rotation'>
    >,
  ) {
    this._ids = _data.map((d) => d.id);
  }

  reverse(state: TrackedMapState) {
    const photos = state.layers.photo.objects.filter((obj) => this._ids.includes(obj.id));

    if (!photos.length) {
      return null;
    }

    return new TransformPhotoAction(
      photos.map((p) => ({
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
        photo: {
          ...state.layers.photo,
          objects: state.layers.photo.objects.map((p) => {
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

  execute(mapId: number): Promise<PhotoDto[]> {
    const tasks = this._data.map((d) =>
      transformPhoto(mapId, d.id, {
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
