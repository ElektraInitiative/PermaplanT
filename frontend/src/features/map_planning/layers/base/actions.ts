import { Action, TrackedMapState } from '../../store/MapStoreTypes';

export class UpdateBaseLayerAction implements Action<void, void> {
  constructor(
    private rotation: number,
    private scale: number,
    private nextcloudImagePath: string,
  ) {}

  reverse(state: TrackedMapState) {
    return new UpdateBaseLayerAction(
      state.layers.Base.rotation,
      state.layers.Base.scale,
      state.layers.Base.nextcloudImagePath,
    );
  }

  apply(state: TrackedMapState): TrackedMapState {
    return {
      ...state,
      layers: {
        ...state.layers,
        Base: {
          ...state.layers.Base,
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
