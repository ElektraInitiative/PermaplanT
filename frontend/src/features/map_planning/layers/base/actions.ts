import { Action, TrackedMapState } from '../../store/MapStoreTypes';
import { LayerType } from '@/bindings/definitions';

export class UpdateBaseLayerAction implements Action<void, void> {
  constructor(
    private rotation: number,
    private scale: number,
    private nextcloudImagePath: string,
  ) {}

  reverse(state: TrackedMapState) {
    return new UpdateBaseLayerAction(
      state.layers.base.rotation,
      state.layers.base.scale,
      state.layers.base.nextcloudImagePath,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        [LayerType.Base]: {
          ...state.layers.base,
          rotation: this.rotation,
          scale: this.scale,
          nextcloudImagePath: this.nextcloudImagePath,
        },
      },
    };
  }

  execute(): Promise<void> {
    // TODO: implement when backend exists
    return new Promise((resolve) => resolve());
  }
}
