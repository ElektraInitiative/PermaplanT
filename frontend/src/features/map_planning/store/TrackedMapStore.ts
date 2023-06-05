import type {
  Action,
  TrackedLayers,
  TrackedMapSlice,
  TrackedMapState,
  UntrackedMapSlice,
} from './MapStoreTypes';
import { LAYER_NAMES } from './MapStoreTypes';
import { PlantLayerObjectDto } from '@/bindings/definitions';
import Konva from 'konva';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { createRef } from 'react';
import type { StateCreator } from 'zustand';

export const TRACKED_DEFAULT_STATE: TrackedMapState = {
  layers: {
    ...LAYER_NAMES.reduce(
      (acc, layerName) => ({
        ...acc,
        [layerName]: {
          index: layerName,
          objects: [],
        },
      }),
      {} as TrackedLayers,
    ),
  },
};

type SetFn = Parameters<typeof createTrackedMapSlice>[0];
type GetFn = Parameters<typeof createTrackedMapSlice>[1];

export const createTrackedMapSlice: StateCreator<
  TrackedMapSlice & UntrackedMapSlice,
  [],
  [],
  TrackedMapSlice
> = (set, get) => {
  return {
    transformer: createRef<Konva.Transformer>(),
    trackedState: TRACKED_DEFAULT_STATE,
    history: [],
    step: 0,
    canUndo: false,
    canRedo: false,
    executeAction: (action: Action<unknown, unknown>) => executeAction(action, set, get),
    undo: () => undo(set, get),
    redo: () => redo(set, get),
    __applyRemoteAction: (action: Action<unknown, unknown>) => applyActionToStore(action, set, get),
    addShapeToTransformer: (node: Shape<ShapeConfig>) => {
      set((state) => {
        const transformer = state.transformer.current;

        const nodes = transformer?.getNodes() || [];
        if (!nodes.includes(node)) {
          transformer?.nodes([node]);
        }

        return state;
      });
    },
    initPlantLayer: (plants: PlantLayerObjectDto[]) =>
      set((state) => ({
        ...state,
        trackedState: {
          ...state.trackedState,
          layers: {
            ...state.trackedState.layers,
            Plant: {
              ...state.trackedState.layers.Plant,
              objects: plants,
            },
          },
        },
      })),
  };
};

/**
 * Execute an action, use it instead of directly calling action.execute().
 * It will also update the history and applies the changes to the store.
 * After execution, the ability to redo any undone action is lost.
 */
function executeAction(action: Action<unknown, unknown>, set: SetFn, get: GetFn) {
  action.execute();
  trackReverseActionInHistory(action, get().step, set, get);
  applyActionToStore(action, set, get);

  set((state) => ({
    ...state,
    step: state.step + 1,
    canRedo: false,
    canUndo: true,
    history: state.history.slice(0, state.step + 1),
  }));
}

/**
 * Apply the action to the store.
 *
 * Do not call this function before `trackReverseActionInHistory`.
 */
function applyActionToStore(action: Action<unknown, unknown>, set: SetFn, get: GetFn): void {
  const newTrackedState = action.apply(get().trackedState);

  set((state) => ({
    ...state,
    trackedState: newTrackedState,
  }));
}

/**
 * Track the reverse action in the history.
 *
 * Always call this function before `applyActionToStore` to track the reverse action in the history.
 * Otherwise, the reverse action will be wrong, or might cause an exception.
 */
function trackReverseActionInHistory(
  action: Action<unknown, unknown>,
  atIndex: number,
  set: SetFn,
  get: GetFn,
): void {
  const reverseAction = action.reverse(get().trackedState);
  if (!reverseAction) {
    throw new Error('Cannot reverse action');
  }

  const history = get().history;
  // replace the action at index `atIndex` with the reverse action
  const newHistory = [...history.slice(0, atIndex), reverseAction, ...history.slice(atIndex + 1)];

  set((state) => ({
    ...state,
    history: newHistory,
  }));
}

/**
 * Undo the action at step - 1.
 */
function undo(set: SetFn, get: GetFn): void {
  if (!get().canUndo) {
    return;
  }

  const actionToUndo = get().history[get().step - 1];
  if (!actionToUndo) {
    throw new Error('Cannot undo action');
  }

  actionToUndo.execute();
  trackReverseActionInHistory(actionToUndo, get().step - 1, set, get);
  applyActionToStore(actionToUndo, set, get);

  set((state) => ({
    ...state,
    step: state.step - 1,
    canUndo: state.step - 1 > 0,
    canRedo: true,
  }));
}

/**
 * Redo the action at the current step.
 */
function redo(set: SetFn, get: GetFn): void {
  if (!get().canRedo) {
    return;
  }

  const actionToRedo = get().history[get().step];
  if (!actionToRedo) {
    throw new Error('Cannot redo action');
  }

  actionToRedo.execute();
  trackReverseActionInHistory(actionToRedo, get().step, set, get);
  applyActionToStore(actionToRedo, set, get);

  set((state) => ({
    ...state,
    step: state.step + 1,
    canUndo: true,
    canRedo: state.step + 1 < state.history.length,
  }));
}
