import type {
  MapAction,
  ObjectAddAction,
  ObjectState,
  ObjectUpdatePositionAction,
  ObjectUpdateTransformAction,
  TrackedAction,
  TrackedLayers,
  TrackedMapSlice,
  TrackedMapState,
  UntrackedMapSlice,
} from './MapStoreTypes';
import { LAYER_NAMES } from './MapStoreTypes';
import i18next from '@/config/i18n';
import { toast } from 'react-toastify';
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

export const createTrackedMapSlice: StateCreator<
  TrackedMapSlice & UntrackedMapSlice,
  [],
  [],
  TrackedMapSlice
> = (set) => ({
  trackedState: TRACKED_DEFAULT_STATE,
  history: [],
  step: 0,
  canUndo: false,
  canRedo: false,
  dispatch: (action) => set((state) => ({ ...state, ...applyActionToState(action, state) })),
});

/**
 * given an action and the current state, return the new state
 */
function applyActionToState(action: MapAction, state: TrackedMapSlice): TrackedMapSlice {
  switch (action.type) {
    case 'OBJECT_ADD':
      return {
        ...state,
        history: [...state.history.slice(0, state.step), action],
        step: state.step + 1,
        trackedState: handleAddObjectAction(state.trackedState, action),
        canUndo: true,
      };

    case 'OBJECT_UPDATE_POSITION':
    case 'OBJECT_UPDATE_TRANSFORM':
      return {
        ...state,
        history: [...state.history.slice(0, state.step), action],
        step: state.step + 1,
        trackedState: handleUpdateObjectAction(state.trackedState, action),
        canUndo: true,
      };

    case 'UNDO': {
      if (state.step <= 0) {
        return state;
      }

      const lastAction = state.history[state.step - 1];
      // TODO: read 'Placeholder' from the lastAction/nextAction
      const action = i18next.t(`undoRedo:${lastAction.type}`, { name: 'Placeholder' });
      toast(i18next.t('undoRedo:successful_undo', { action }));

      return {
        ...state,
        trackedState: reduceHistory(state.history.slice(0, state.step - 1)),
        step: state.step - 1,
        canUndo: state.step - 1 > 0,
        canRedo: state.step - 1 < state.history.length,
      };
    }

    case 'REDO': {
      if (state.step >= state.history.length) {
        return state;
      }

      const nextAction = state.history[state.step];
      // TODO: read 'Placeholder' from the lastAction/nextAction
      const action = i18next.t(`undoRedo:${nextAction.type}`, { name: 'Placeholder' });
      toast(i18next.t('undoRedo:successful_redo', { action }));

      return {
        ...state,
        trackedState: reduceHistory(state.history.slice(0, state.step + 1)),
        step: state.step + 1,
        canRedo: state.step + 1 < state.history.length,
        canUndo: state.step + 1 > 0,
      };
    }

    default:
      return state;
  }
}

function handleAddObjectAction(state: TrackedMapState, action: ObjectAddAction): TrackedMapState {
  return {
    ...state,
    layers: {
      ...state.layers,
      [action.payload.index]: {
        ...state.layers[action.payload.index],
        objects: [...state.layers[action.payload.index].objects, action.payload],
      },
    },
  };
}

function handleUpdateObjectAction(
  state: TrackedMapState,
  action: ObjectUpdatePositionAction | ObjectUpdateTransformAction,
): TrackedMapState {
  return {
    ...state,
    layers: {
      ...state.layers,
      ...action.payload.reduce(reduceObjectUpdatesToLayers, state.layers),
    },
  };
}
function reduceObjectUpdatesToLayers(
  layers: TrackedLayers,
  objectUpdate: ObjectState,
): TrackedLayers {
  const layerIndex = objectUpdate.index;

  return {
    ...layers,
    [layerIndex]: {
      ...layers[layerIndex],
      objects: layers[layerIndex].objects.map((obj) => {
        if (obj.id === objectUpdate.id) {
          return objectUpdate;
        }

        return obj;
      }),
    },
  };
}

/**
 * given a history of actions, reduce it into a single state, that is the sum of all actions
 */
function reduceHistory(history: TrackedAction[]): TrackedMapState {
  const state = history.reduce((state, action) => {
    switch (action.type) {
      case 'OBJECT_ADD':
        return handleAddObjectAction(state, action);

      case 'OBJECT_UPDATE_POSITION':
      case 'OBJECT_UPDATE_TRANSFORM':
        return handleUpdateObjectAction(state, action);

      default:
        return state;
    }
  }, TRACKED_DEFAULT_STATE);

  return state;
}
