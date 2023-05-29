import { createPlanting } from '../api/createPlanting';
import { deletePlanting } from '../api/deletePlanting';
import type {
  MapAction,
  CreatePlantAction,
  DeletePlantAction,
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
import { RemoteActionSchema } from './RemoteActions';
import { baseApiUrl } from '@/config';
import i18next from '@/config/i18n';
import { getUser } from '@/utils/getUser';
import Konva from 'konva';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { createRef } from 'react';
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
> = (set) => {
  const user = getUser();
  if (!user) {
    // TODO: implement protected routes.
    toast.error("You're not logged in.");
  }

  if (user) {
    const mapUpdateSource = new EventSource(`${baseApiUrl}/api/map_updates/${user?.profile.sub}`);
    mapUpdateSource.onmessage = handleRemoteAction(set);
  }

  return {
    transformer: createRef<Konva.Transformer>(),
    trackedState: TRACKED_DEFAULT_STATE,
    history: [],
    step: 0,
    canUndo: false,
    canRedo: false,
    dispatch: (action) => set((state) => ({ ...state, ...applyActionToState(action, state) })),
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
  };
};

/**
 * given an action and the current state, return the new state
 */
function applyActionToState(action: MapAction, state: TrackedMapSlice): TrackedMapSlice {
  switch (action.type) {
    case 'CREATE_PLANT':
      return {
        ...state,
        history: [
          ...state.history.slice(0, state.step),
          {
            redo: action,
            undo: {
              type: 'DELETE_PLANT',
              payload: {
                index: 'Plant',
                id: action.payload.id,
              },
            },
          },
        ],
        step: state.step + 1,
        trackedState: handleCreatePlantAction(state.trackedState, action),
        canUndo: true,
      };

    case 'OBJECT_UPDATE_POSITION':
    case 'OBJECT_UPDATE_TRANSFORM':
      return {
        ...state,
        history: [
          ...state.history.slice(0, state.step),
          {
            redo: action,
            // TODO: fix this
            undo: action,
          },
        ],
        step: state.step + 1,
        trackedState: handleUpdateObjectAction(state.trackedState, action),
        canUndo: true,
      };

    case 'UNDO':
      return handleUndo(state);

    case 'REDO':
      return handleRedo(state);

    default:
      return state;
  }
}

function handleCreatePlantAction(
  state: TrackedMapState,
  action: CreatePlantAction,
): TrackedMapState {
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

function handleDeletePlantAction(
  state: TrackedMapState,
  action: DeletePlantAction,
): TrackedMapState {
  return {
    ...state,
    layers: {
      ...state.layers,
      [action.payload.index]: {
        ...state.layers[action.payload.index],
        objects: state.layers[action.payload.index].objects.filter(
          (obj) => obj.id !== action.payload.id,
        ),
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

type SetFn = Parameters<typeof createTrackedMapSlice>[0];

export function handleRemoteAction(set: SetFn) {
  return (event: MessageEvent<unknown>) => {
    const action = validateRemoteAction(event);

    console.log('remote action', action);

    switch (action?.type) {
      case 'CREATE_PLANT':
        set((state) => ({
          ...state,
          trackedState: handleCreatePlantAction(state.trackedState, {
            type: 'CREATE_PLANT',
            payload: {
              id: action.payload.id,
              index: 'Plant',
              x: action.payload.x,
              y: action.payload.y,
              width: 100,
              height: 100,
              rotation: 0,
              scaleX: 1,
              scaleY: 1,
              type: 'plant',
            },
          }),
        }));
        break;

      case 'DELETE_PLANT':
        set((state) => ({
          ...state,
          trackedState: handleDeletePlantAction(state.trackedState, {
            type: 'DELETE_PLANT',
            payload: {
              id: action.payload.id,
              index: 'Plant',
            },
          }),
        }));
        break;

      default:
        break;
    }
  };
}

function handleUndo(state: TrackedMapSlice): TrackedMapSlice {
  if (state.step <= 0) {
    return state;
  }

  // TODO: read 'Placeholder' from the lastAction/nextAction
  const action = i18next.t(`undoRedo:${state.history[state.step - 1].redo.type}`, {
    name: 'Placeholder',
  });
  toast(i18next.t('undoRedo:successful_undo', { action }));

  // reset the transformer
  state.transformer.current?.nodes([]);

  const previousAction = state.history[state.step - 1].undo;

  return {
    ...state,
    trackedState: handleUndoAction(state.trackedState, previousAction),
    step: state.step - 1,
    canUndo: state.step - 1 > 0,
    canRedo: state.step - 1 < state.history.length,
  };
}

function handleUndoAction(state: TrackedMapState, action: TrackedAction): TrackedMapState {
  switch (action.type) {
    case 'CREATE_PLANT':
      createPlanting({
        plant_id: Number(action.payload.id),
        plants_layer_id: 1,
        x: action.payload.x,
        y: action.payload.y,
      });

      return handleCreatePlantAction(state, action);

    case 'DELETE_PLANT':
      deletePlanting(action.payload.id);

      return handleDeletePlantAction(state, action);

    default:
      return state;
  }
}

function handleRedo(state: TrackedMapSlice): TrackedMapSlice {
  if (state.step >= state.history.length) {
    return state;
  }

  const nextAction = state.history[state.step];
  // TODO: read 'Placeholder' from the lastAction/nextAction
  const action = i18next.t(`undoRedo:${nextAction.redo.type}`, { name: 'Placeholder' });
  toast(i18next.t('undoRedo:successful_redo', { action }));

  // reset the transformer
  state.transformer.current?.nodes([]);

  return {
    ...state,
    // TODO: fix this
    trackedState: state.trackedState,
    step: state.step + 1,
    canRedo: state.step + 1 < state.history.length,
    canUndo: state.step + 1 > 0,
  };
}

function validateRemoteAction(event: MessageEvent<unknown>) {
  if (typeof event.data !== 'string') {
    return null;
  }

  try {
    const action = JSON.parse(event.data);
    return RemoteActionSchema.parse(action);
  } catch (e) {
    return null;
  }
}
