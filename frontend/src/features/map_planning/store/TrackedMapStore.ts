import { filterVisibleObjects } from '../utils/filterVisibleObjects';
import {
  Action,
  GetFn,
  SetFn,
  TRACKED_DEFAULT_STATE,
  TrackedMapSlice,
  UNTRACKED_DEFAULT_STATE,
  UntrackedMapSlice,
} from './MapStoreTypes';
import { clearInvalidSelection } from './utils';
import { BaseLayerImageDto, PlantingDto } from '@/bindings/definitions';
import Konva from 'konva';
import { Node } from 'konva/lib/Node';
import { createRef } from 'react';
import type { StateCreator } from 'zustand';

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
    addShapeToTransformer: (node: Node) => {
      const transformer = get().transformer.current;
      const nodes = transformer?.getNodes() || [];
      if (!nodes.includes(node)) {
        transformer?.nodes([node]);
      }
    },
    initPlantLayer: (plants: PlantingDto[]) => {
      set((state) => ({
        ...state,
        trackedState: {
          ...state.trackedState,
          layers: {
            ...state.trackedState.layers,
            plants: {
              ...state.trackedState.layers.plants,
              objects: filterVisibleObjects(plants, state.untrackedState.timelineDate),
              loadedObjects: plants,
            },
          },
        },
      }));
    },
    initBaseLayer(dto: BaseLayerImageDto) {
      set((state) => ({
        ...state,
        trackedState: {
          ...state.trackedState,
          layers: {
            ...state.trackedState.layers,
            base: {
              ...state.trackedState.layers.base,
              imageId: dto.id,
              layerId: dto.layer_id,
              rotation: dto.rotation,
              scale: dto.scale,
              nextcloudImagePath: dto.path,
            },
          },
        },
      }));
    },
    initLayerId(layer, layerId) {
      set((state) => ({
        ...state,
        trackedState: {
          ...state.trackedState,
          layers: {
            ...state.trackedState.layers,
            [layer]: {
              ...state.trackedState.layers[layer],
              id: layerId,
            },
          },
        },
      }));
    },
    __resetStore() {
      set((state) => ({
        ...state,
        trackedState: TRACKED_DEFAULT_STATE,
        untrackedState: UNTRACKED_DEFAULT_STATE,
        history: [],
        step: 0,
        canUndo: false,
        canRedo: false,
      }));
    },
  };
};

/**
 * Execute an action, use it instead of directly calling action.execute().
 * It will also update the history and applies the changes to the store.
 * After execution, the ability to redo any undone action is lost.
 */
function executeAction(action: Action<unknown, unknown>, set: SetFn, get: GetFn) {
  const reverseAction = action.reverse(get().trackedState);

  trackUserAction(action, set);
  action.execute(get().untrackedState.mapId).catch(() => {
    if (!reverseAction) {
      throw new Error('Cannot reverse action');
    }

    applyActionToStore(reverseAction, set, get);
  });

  trackReverseActionInHistory(action, get().step, set, get);
  applyActionToStore(action, set, get);
  clearInvalidSelection(get);

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
 * Tracks the user action such that RemoteActions can be filtered.
 */
function trackUserAction(action: Action<unknown, unknown>, set: SetFn) {
  set((state) => ({
    ...state,
    lastActions: [
      ...state.lastActions,
      ...action.entityIds.map((id) => ({ actionId: action.actionId, entityId: id })),
    ],
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

  trackUserAction(actionToUndo, set);
  actionToUndo.execute(get().untrackedState.mapId);
  trackReverseActionInHistory(actionToUndo, get().step - 1, set, get);
  applyActionToStore(actionToUndo, set, get);
  clearInvalidSelection(get);

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

  trackUserAction(actionToRedo, set);
  actionToRedo.execute(get().untrackedState.mapId);
  trackReverseActionInHistory(actionToRedo, get().step, set, get);
  applyActionToStore(actionToRedo, set, get);
  clearInvalidSelection(get);

  set((state) => ({
    ...state,
    step: state.step + 1,
    canUndo: true,
    canRedo: state.step + 1 < state.history.length,
  }));
}
