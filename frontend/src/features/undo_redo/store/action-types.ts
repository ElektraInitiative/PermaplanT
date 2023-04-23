/**
 * @module features/undo_redo/store/action-types
 * This module contains the types for the actions that can be dispatched to the map history store.
 */
import { ObjectState } from './state-types';

/**
 * An action for adding an object to the map.
 */
export type ObjectAddAction = {
  type: 'OBJECT_ADD';
  payload: ObjectState;
};

/**
 * An action for updating an object on the map.
 */
export type ObjectUpdateAction = {
  type: 'OBJECT_UPDATE';
  payload: ObjectState[];
};

/**
 * An action for undoing the previous action in the history.
 */
export type UndoAction = {
  type: 'UNDO';
};

/**
 * An action for redoing the next action in the history.
 */
export type RedoAction = {
  type: 'REDO';
};

/**
 * A union type for all actions.
 */
export type MapAction = ObjectAddAction | ObjectUpdateAction | UndoAction | RedoAction;
