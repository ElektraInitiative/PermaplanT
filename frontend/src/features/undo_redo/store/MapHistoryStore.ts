import type {
  MapAction,
  ObjectAddAction,
  ObjectCopyToClipboardAction,
  ObjectUpdatePositionAction,
  ObjectUpdateTransformAction,
  TrackedAction,
} from './action-types';
import type { Layers, MapState, ObjectState } from './state-types';
import i18next from '@/config/i18n';
import Konva from 'konva';
import { createRef } from 'react';
import { toast } from 'react-toastify';
import { create } from 'zustand';

type MapStore = {
  history: TrackedAction[];
  step: number;
  state: MapState;
  clipboard: MapState;
  transformer: React.RefObject<Konva.Transformer>;
  dispatch: (action: MapAction) => void;
  canUndo: boolean;
  canRedo: boolean;
};

export const DEFAULT_STATE: MapState = {
  layers: {
    plant: {
      index: 'plant',
      visible: true,
      objects: [],
    },
  },
};

const useMapStore = create<MapStore>((set) => ({
  history: [],
  step: 0,
  state: DEFAULT_STATE,
  clipboard: DEFAULT_STATE,
  dispatch: (action) => set((state) => applyActionToState(action, state)),
  canUndo: false,
  canRedo: false,
  transformer: createRef<Konva.Transformer>(),
}));

/**
 * given an action and the current state, return the new state
 */
function applyActionToState(action: MapAction, state: MapStore): MapStore {
  switch (action.type) {
    case 'OBJECT_ADD':
      return {
        ...state,
        history: [...state.history.slice(0, state.step), action],
        step: state.step + 1,
        state: handleAddObjectAction(state.state, action),
        canUndo: true,
      };

    case 'OBJECT_UPDATE_POSITION':
    case 'OBJECT_UPDATE_TRANSFORM':
      return {
        ...state,
        history: [...state.history.slice(0, state.step), action],
        step: state.step + 1,
        state: handleUpdateObjectAction(state.state, action),
        canUndo: true,
      };

    case 'OBJECT_COPY_TO_CLIPBOARD':
      return {
        ...state,
        clipboard: handleCopyToClipboardAction(state.clipboard, action),
      };

    case 'OBJECT_PASTE_CLIPBOARD':
      return {
        ...state,
        history: [...state.history.slice(0, state.step), action],
        step: state.step + 1,
        state: handlePasteClipboardAction(state.state, state.clipboard),
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
        state: reduceHistory(state.history.slice(0, state.step - 1)),
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
        state: reduceHistory(state.history.slice(0, state.step + 1)),
        step: state.step + 1,
        canRedo: state.step + 1 < state.history.length,
        canUndo: state.step + 1 > 0,
      };
    }

    default:
      return state;
  }
}

function handleAddObjectAction(state: MapState, action: ObjectAddAction): MapState {
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

function handlePasteClipboardAction(state: MapState, clipboard: MapState): MapState {
  const newLayers = { ...state.layers };

  clipboard.layers.plant.objects.forEach((object) => {
    const layerIndex = object.index;
    const newObject = { ...object };
    const existingObjects = newLayers[layerIndex]?.objects || [];

    newLayers[layerIndex] = {
      ...newLayers[layerIndex],
      objects: [...existingObjects, newObject],
    };
  });

  return {
    ...state,
    layers: newLayers,
  };
}

function handleCopyToClipboardAction(
  state: MapState,
  action: ObjectCopyToClipboardAction,
): MapState {
  return {
    ...state,
    layers: reduceObjectsToLayers(state.layers, action.payload),
  };
}

function handleUpdateObjectAction(
  state: MapState,
  action: ObjectUpdatePositionAction | ObjectUpdateTransformAction,
): MapState {
  return {
    ...state,
    layers: {
      ...state.layers,
      ...action.payload.reduce(reduceObjectUpdatesToLayers, state.layers),
    },
  };
}
function reduceObjectUpdatesToLayers(layers: Layers, objectUpdate: ObjectState): Layers {
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

function reduceObjectsToLayers(layers: Layers, objectStates: ObjectState[]): Layers {
  const updatedLayers = { ...layers };
  objectStates.forEach((objectState) => {
    const layerIndex = objectState.index;
    updatedLayers[layerIndex].objects.push(objectState);
  });
  return updatedLayers;
}

/**
 * given a history of actions, reduce it into a single state, that is the sum of all actions
 */
function reduceHistory(history: TrackedAction[]): MapState {
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
  }, DEFAULT_STATE);

  return state;
}

export default useMapStore;
