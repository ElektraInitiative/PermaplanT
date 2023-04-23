import type { MapAction, ObjectAddAction, ObjectUpdateAction } from './action-types';
import type { MapState } from './state-types';
import { create } from 'zustand';

type MapHistoryState = {
  history: MapAction[];
  step: number;
  state: MapState;
};

interface MapStateAPI {
  dispatch: (action: MapAction) => void;
  canUndo: boolean;
  canRedo: boolean;
}

type MapStore = MapHistoryState & MapStateAPI;

const DEFAULT_STATE: MapState = {
  stage: {
    scale: 1,
    x: 0,
    y: 0,
    layers: {
      plant: {
        index: 'plant',
        visible: true,
        objects: [],
      },
    },
  },
};

const useMapState = create<MapStore>((set) => ({
  history: [],
  step: 0,
  state: DEFAULT_STATE,
  dispatch: (action) => set((state) => handleDispatch(state, action)),
  canUndo: false,
  canRedo: false,
}));

function handleDispatch(state: MapStore, action: MapAction): MapStore {
  switch (action.type) {
    case 'OBJECT_ADD':
      return {
        ...state,
        history: [...state.history.slice(0, state.step), action],
        step: state.step + 1,
        state: handleAddObject(state.state, action),
        canUndo: true,
      };

    case 'OBJECT_UPDATE':
      return {
        ...state,
        history: [...state.history.slice(0, state.step), action],
        step: state.step + 1,
        state: handleUpdateObject(state.state, action),
        canUndo: true,
      };

    case 'UNDO':
      if (state.step <= 0) {
        return state;
      }

      return {
        ...state,
        state: reduceHistory(state.history.slice(0, state.step - 1)),
        step: state.step - 1,
        canUndo: state.step - 1 > 0,
        canRedo: state.step - 1 < state.history.length,
      };

    case 'REDO':
      if (state.step >= state.history.length) {
        return state;
      }

      return {
        ...state,
        state: reduceHistory(state.history.slice(0, state.step + 1)),
        step: state.step + 1,
        canRedo: state.step + 1 < state.history.length,
        canUndo: state.step + 1 > 0,
      };

    default:
      return state;
  }
}

function handleAddObject(state: MapState, action: ObjectAddAction): MapState {
  return {
    ...state,
    stage: {
      ...state.stage,
      layers: {
        ...state.stage.layers,
        [action.payload.index]: {
          ...state.stage.layers[action.payload.index],
          objects: [...state.stage.layers[action.payload.index].objects, action.payload],
        },
      },
    },
  };
}

function handleUpdateObject(state: MapState, action: ObjectUpdateAction): MapState {
  return {
    ...state,
    stage: {
      ...state.stage,
      layers: {
        ...state.stage.layers,
        [action.payload.index]: {
          ...state.stage.layers[action.payload.index],
          objects: state.stage.layers[action.payload.index].objects.map((object) => {
            if (object.id === action.payload.id) {
              return action.payload;
            }
            return object;
          }),
        },
      },
    },
  };
}

function reduceHistory(history: MapAction[]): MapState {
  const state = history.reduce((state, action) => {
    switch (action.type) {
      case 'OBJECT_ADD':
        return handleAddObject(state, action);

      case 'OBJECT_UPDATE':
        return handleUpdateObject(state, action);

      default:
        return state;
    }
  }, DEFAULT_STATE);

  return state;
}

export default useMapState;
