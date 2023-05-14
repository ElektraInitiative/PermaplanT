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
export type ObjectUpdatePositionAction = {
  type: 'OBJECT_UPDATE_POSITION';
  payload: ObjectState[];
};

/**
 * An action for updating an object on the map.
 */
export type ObjectUpdateTransformAction = {
  type: 'OBJECT_UPDATE_TRANSFORM';
  payload: ObjectState[];
};

export type ObjectCopyToClipboardAction = {
  type: 'OBJECT_COPY_TO_CLIPBOARD';
  payload: ObjectState[];
};

export type ObjectPasteClipboardAction = {
  type: 'OBJECT_PASTE_CLIPBOARD';
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
export type MapAction =
  | ObjectAddAction
  | ObjectUpdatePositionAction
  | ObjectUpdateTransformAction
  | ObjectCopyToClipboardAction
  | ObjectPasteClipboardAction
  | UndoAction
  | RedoAction;

/**
 * A union type for all actions that are tracked in the history.
 */
export type TrackedAction = Exclude<MapAction, UndoAction | RedoAction>;
