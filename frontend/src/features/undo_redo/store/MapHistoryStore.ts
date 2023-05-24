import type {
  MapAction,
  ObjectAddAction,
  ObjectUpdatePositionAction,
  ObjectUpdateTransformAction,
  TrackedAction,
} from './action-types';
import type { LayerName, Layers, LayerState, MapState, ObjectState } from './state-types';
import i18next from '@/config/i18n';
import Konva from 'konva';
import { createRef } from 'react';
import { toast } from 'react-toastify';
import { create } from 'zustand';

type MapStore = {
  history: TrackedAction[];
  step: number;
  state: MapState;
  transformer: React.RefObject<Konva.Transformer>;
  dispatch: (action: MapAction) => void;
  canUndo: boolean;
  canRedo: boolean;
  updateSelectedLayer: (selectedLayer: LayerName) => void;
  updateLayerVisible: (layerName: LayerName, visible: LayerState['visible']) => void;
  updateLayerOpacity: (layerName: LayerName, opacity: LayerState['opacity']) => void;
};

export const DEFAULT_STATE: MapState = {
  selectedLayer: 'Base',
  layers: {
    Plant: {
      index: 'Plant',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Base: {
      index: 'Base',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Drawing: {
      index: 'Drawing',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Dimension: {
      index: 'Dimension',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Fertilization: {
      index: 'Fertilization',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Habitats: {
      index: 'Habitats',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Hydrology: {
      index: 'Hydrology',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Infrastructure: {
      index: 'Infrastructure',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Labels: {
      index: 'Labels',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Landscape: {
      index: 'Landscape',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Paths: {
      index: 'Paths',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Shade: {
      index: 'Shade',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Soil: {
      index: 'Soil',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Terrain: {
      index: 'Terrain',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Trees: {
      index: 'Trees',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Warnings: {
      index: 'Warnings',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Winds: {
      index: 'Winds',
      visible: true,
      opacity: 1,
      objects: [],
    },
    Zones: {
      index: 'Zones',
      visible: true,
      opacity: 1,
      objects: [],
    },
  },
};

const useMapStore = create<MapStore>((set) => ({
  history: [],
  step: 0,
  state: DEFAULT_STATE,
  dispatch: (action) => set((state) => applyActionToState(action, state)),
  canUndo: false,
  canRedo: false,
  transformer: createRef<Konva.Transformer>(),
  updateSelectedLayer: (selectedLayer: LayerName) =>
    set((state) => ({
      ...state,
      state: {
        ...state.state,
        selectedLayer: selectedLayer,
      },
    })),
  updateLayerVisible: (layerName: LayerName, visible: LayerState['visible']) =>
    set((state) => ({
      ...state,
      state: {
        ...state.state,
        layers: {
          ...state.state.layers,
          [layerName]: {
            ...state.state.layers[layerName],
            visible: visible,
          },
        },
      },
    })),
  updateLayerOpacity: (layerName: LayerName, opacity: LayerState['opacity']) =>
    set((state) => ({
      ...state,
      state: {
        ...state.state,
        layers: {
          ...state.state.layers,
          [layerName]: {
            ...state.state.layers[layerName],
            opacity: opacity,
          },
        },
      },
    })),
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
