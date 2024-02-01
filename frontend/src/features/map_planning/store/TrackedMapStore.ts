import type { StateCreator } from 'zustand';
import { BaseLayerImageDto, PlantingDto } from '@/api_types/definitions';
import { filterVisibleObjects } from '../utils/filterVisibleObjects';
import type { Action, GetFn, SetFn, TrackedMapSlice, UntrackedMapSlice } from './MapStoreTypes';
import { UNTRACKED_DEFAULT_STATE, TRACKED_DEFAULT_STATE } from './MapStoreTypes';
import { clearInvalidSelection } from './utils';

export const createTrackedMapSlice: StateCreator<
  TrackedMapSlice & UntrackedMapSlice,
  [],
  [],
  TrackedMapSlice
> = (set, get) => {
  return {
    trackedState: TRACKED_DEFAULT_STATE,
    history: [],
    step: 0,
    canUndo: false,
    canRedo: false,
    executeAction: (action: Action<unknown, unknown>) => executeAction(action, set, get),
    undo: () => undo(set, get),
    redo: () => redo(set, get),
    __applyRemoteAction: (action: Action<unknown, unknown>) => applyAction(action, set, get),
    setSingleNodeInTransformer: (node: Node) => {
      get().transformer?.current?.nodes([node]);
    },
    addNodeToTransformer: (node: Node) => {
      const currentNodes = get().transformer.current?.nodes() ?? [];
      if (!currentNodes.includes(node)) {
        get().transformer?.current?.nodes([...currentNodes, node]);
      }
    },
    removeNodeFromTransformer: (node: Node) => {
      const currentNodes = get().transformer.current?.nodes() ?? [];
      const nodeToRemove = currentNodes.indexOf(node);

      if (nodeToRemove !== -1) {
        const newNodes = currentNodes.slice();
        newNodes.splice(nodeToRemove, 1);
        get().transformer.current?.nodes(newNodes);
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
 * Executes an action.
 * This function is used instead of directly calling action.execute().
 * It will also update the history and apply the changes to the store.
 * After execution, the ability to redo any undone action is lost.
 */
function executeAction(action: Action<unknown, unknown>, set: SetFn, get: GetFn) {
  trackUserAction(action, set);

  executeActionImpl(action, set, get);
  trackReverseActionInHistory(action, get().step, set, get);
  applyAction(action, set, get);

  set((state) => ({
    ...state,
    step: state.step + 1,
    canRedo: false,
    canUndo: true,
    history: state.history.slice(0, state.step + 1),
  }));
}

/**
 * Applies the action to the store.
 * Also executing functions that depend on the updated store.
 */
function applyAction(action: Action<unknown, unknown>, set: SetFn, get: GetFn): void {
  applyActionToStore(action, set, get);
  updateSelectedPlantings(set, get);
  clearInvalidSelection(get);
}

/**
 * Tracks the user action by its `actionId`.
 * RemoteActions that have such id are filtered out.
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
 * Tracks the reverse action in the history.
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
  executeActionImpl(actionToUndo, set, get);
  trackReverseActionInHistory(actionToUndo, get().step - 1, set, get);
  applyAction(actionToUndo, set, get);

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
  executeActionImpl(actionToRedo, set, get);
  trackReverseActionInHistory(actionToRedo, get().step, set, get);
  applyAction(actionToRedo, set, get);

  set((state) => ({
    ...state,
    step: state.step + 1,
    canUndo: true,
    canRedo: state.step + 1 < state.history.length,
  }));
}

/**
 * Executes the action by calling its execute function and handles errors.
 */
function executeActionImpl(action: Action<unknown, unknown>, set: SetFn, get: GetFn): void {
  // this works because zustand returns a copy of the state see `zustand_get.test.ts`
  const snap = get();

  action.execute(get().untrackedState.mapId).catch(() => {
    // if the action fails, revert to the previous state
    set(snap);
  });
}

/**
 * Replaces the selected plantings with fresh versions from the backend.
 */
function updateSelectedPlantings(set: SetFn, get: GetFn) {
  const selectedPlantings = get().untrackedState.layers.plants.selectedPlantings;
  if (!selectedPlantings?.length) {
    return;
  }

  const updatedSelectedPlantings = getUpdatesForSelectedPlantings(get, selectedPlantings);

  set((state) => ({
    ...state,
    untrackedState: {
      ...state.untrackedState,
      layers: {
        ...state.untrackedState.layers,
        plants: {
          ...state.untrackedState.layers.plants,
          selectedPlantings: updatedSelectedPlantings,
        },
      },
    },
  }));
}

function getUpdatesForSelectedPlantings(get: GetFn, selectedPlantings: PlantingDto[]) {
  const loadUpdateForSelectedPlanting = (selectedPlanting: PlantingDto) => {
    return get().trackedState.layers.plants.loadedObjects.find(
      (loadedPlanting) => loadedPlanting.id === selectedPlanting.id,
    );
  };

  const updatePlantings = (
    updatedPlantings: PlantingDto[],
    selectedPlanting: PlantingDto,
  ) => {
    const updatedPlanting = loadUpdateForSelectedPlanting(selectedPlanting);

    return updatedPlanting ? [...updatedPlantings, updatedPlanting] : updatedPlantings;
  };

  return selectedPlantings.reduce(updatePlantings, []);
}
