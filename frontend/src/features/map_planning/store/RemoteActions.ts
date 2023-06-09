import {
  CreatePlantAction,
  DeletePlantAction,
  MovePlantAction,
  TransformPlantAction,
} from '../layers/plant/actions';
import useMapStore from './MapStore';
import { Action } from './MapStoreTypes';
import { Action as RemoteAction } from '@/bindings/definitions';
import { User } from 'oidc-client-ts';

export function handleRemoteAction(ev: MessageEvent<unknown>, user: User) {
  if (typeof ev.data !== 'string') {
    console.error('Received non-string message from server');
    return;
  }

  if (ev.data === 'connected') {
    // Ignore the initial connected message
    return;
  }

  let remoteAction: RemoteAction;
  try {
    remoteAction = JSON.parse(ev.data);
  } catch (e) {
    console.error(e);
    return;
  }

  if (remoteAction.payload.userId === user.profile.sub) {
    // Ignore actions from self, later this can be used to handle conflicts.
    // see https://www.figma.com/blog/how-figmas-multiplayer-technology-works/#syncing-object-properties
    return;
  }

  const action = convertToAction(remoteAction);

  useMapStore.getState().__applyRemoteAction(action);
}

function convertToAction(remoteAction: RemoteAction): Action<unknown, unknown> {
  switch (remoteAction.type) {
    case 'CreatePlanting':
      return new CreatePlantAction({ ...remoteAction.payload });
    case 'DeletePlanting':
      return new DeletePlantAction(remoteAction.payload.id);
    case 'MovePlanting':
      return new MovePlantAction([{ ...remoteAction.payload }]);
    case 'TransformPlanting':
      return new TransformPlantAction([{ ...remoteAction.payload }]);
    default:
      throw new Error(`Unknown remote action`) as never;
  }
}
