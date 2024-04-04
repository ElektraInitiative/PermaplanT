import { Action as RemoteAction } from '@/api_types/definitions';
import {
  CreateShadingAction,
  DeleteShadingAction,
  UpdateShadingAction,
  UpdateShadingAddDateAction,
  UpdateShadingRemoveDateAction,
} from '@/features/map_planning/layers/shade/actions';
import { UpdateBaseLayerAction, UpdateMapGeometry } from '../layers/base/actions';
import {
  CreatePlantAction,
  DeletePlantAction,
  MovePlantAction,
  TransformPlantAction,
  UpdateAddDatePlantAction,
  UpdatePlantingAdditionalName,
  UpdateRemoveDatePlantAction,
} from '../layers/plant/actions';
import useMapStore from './MapStore';
import { Action } from './MapStoreTypes';

export function handleRemoteAction(ev: MessageEvent<unknown>, userId: string) {
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

  const action = convertToAction(remoteAction);

  if (remoteAction.payload.userId === userId) {
    // Ignore actions that are sent back to the user that initiated them.
    // see https://www.figma.com/blog/how-figmas-multiplayer-technology-works/#syncing-object-properties
    const lastActions = useMapStore.getState().lastActions;

    const lastAction = lastActions.find(
      (a) => a.actionId === action.actionId && a.entityId === action.entityIds[0],
    );
    if (lastAction) {
      useMapStore.getState().__removeLastAction(lastAction);
      return;
    }
  }

  useMapStore.getState().__applyRemoteAction(action);
}

function convertToAction(remoteAction: RemoteAction): Action<unknown, unknown> {
  switch (remoteAction.type) {
    case 'CreatePlanting':
      return new CreatePlantAction({ ...remoteAction.payload }, remoteAction.payload.actionId);
    case 'DeletePlanting':
      return new DeletePlantAction({ ...remoteAction.payload }, remoteAction.payload.actionId);
    case 'MovePlanting':
      return new MovePlantAction([{ ...remoteAction.payload }], remoteAction.payload.actionId);
    case 'TransformPlanting':
      return new TransformPlantAction([{ ...remoteAction.payload }], remoteAction.payload.actionId);
    case 'UpdatePlantingAddDate':
      return new UpdateAddDatePlantAction(
        { ...remoteAction.payload },
        remoteAction.payload.actionId,
      );
    case 'UpdatePlantingRemoveDate':
      return new UpdateRemoveDatePlantAction(
        { ...remoteAction.payload },
        remoteAction.payload.actionId,
      );
    case 'UpdateBaseLayerImage':
      return new UpdateBaseLayerAction(
        { ...remoteAction.payload, layer_id: remoteAction.payload.layerId },
        remoteAction.payload.actionId,
      );
    case 'UpdateMapGeometry':
      return new UpdateMapGeometry({ ...remoteAction.payload }, remoteAction.payload.actionId);
    case 'UpdatePlantingAdditionalName':
      return new UpdatePlantingAdditionalName(
        { ...remoteAction.payload },
        remoteAction.payload.actionId,
      );
    case 'CreateShading':
      return new CreateShadingAction(
        { ...remoteAction.payload, layerId: remoteAction.payload.layerId },
        remoteAction.payload.actionId,
      );
    case 'DeleteShading':
      return new DeleteShadingAction({ ...remoteAction.payload }, remoteAction.payload.actionId);
    case 'UpdateShading':
      return new UpdateShadingAction({ ...remoteAction.payload }, remoteAction.payload.actionId);
    case 'UpdateShadingAddDate':
      return new UpdateShadingAddDateAction(
        { ...remoteAction.payload },
        remoteAction.payload.actionId,
      );
    case 'UpdateShadingRemoveDate':
      return new UpdateShadingRemoveDateAction(
        { ...remoteAction.payload },
        remoteAction.payload.actionId,
      );
    default:
      throw new Error(`Unknown remote action`) as never;
  }
}
