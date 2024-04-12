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
  CreateDrawingAction,
  UpdateDrawingAction,
  DeleteDrawingAction,
  UpdateDrawingAddDateAction,
  UpdateDrawingRemoveDateAction,
} from '../layers/drawing/actions';
import {
  CreatePlantAction,
  DeletePlantAction,
  MovePlantAction,
  TransformPlantAction,
  UpdateAddDatePlantAction,
  UpdatePlantingAdditionalName,
  UpdatePlantingNotesAction,
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

  if (remoteAction.userId === userId) {
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
  switch (remoteAction.action.type) {
    case 'CreatePlanting':
      return new CreatePlantAction(remoteAction.action.payload, remoteAction.actionId);
    case 'DeletePlanting':
      return new DeletePlantAction(remoteAction.action.payload, remoteAction.actionId);
    case 'MovePlanting':
      return new MovePlantAction(remoteAction.action.payload, remoteAction.actionId);
    case 'TransformPlanting':
      return new TransformPlantAction(remoteAction.action.payload, remoteAction.actionId);
    case 'UpdatePlantingAddDate':
      return new UpdateAddDatePlantAction(remoteAction.action.payload, remoteAction.actionId);
    case 'UpdatePlantingRemoveDate':
      return new UpdateRemoveDatePlantAction(remoteAction.action.payload, remoteAction.actionId);
    case 'UpdateBaseLayerImage':
      return new UpdateBaseLayerAction(
        { ...remoteAction.action.payload, layer_id: remoteAction.action.payload.layerId },
        remoteAction.actionId,
      );
    case 'UpdateMapGeometry':
      return new UpdateMapGeometry({ ...remoteAction.action.payload }, remoteAction.actionId);
    case 'UpdatePlantingAdditionalName':
      return new UpdatePlantingAdditionalName(
        { ...remoteAction.action.payload },
        remoteAction.actionId,
      );
    case 'UpdatePlatingNotes':
      return new UpdatePlantingNotesAction(remoteAction.action.payload, remoteAction.actionId);

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

    case 'CreateDrawing':
      return new CreateDrawingAction(remoteAction.action.payload, remoteAction.actionId);
    case 'UpdateDrawing':
      return new UpdateDrawingAction(remoteAction.action.payload, remoteAction.actionId);
    case 'DeleteDrawing':
      return new DeleteDrawingAction(remoteAction.action.payload, remoteAction.actionId);

    case 'UpdateDrawingAddDate':
      return new UpdateDrawingAddDateAction(remoteAction.action.payload, remoteAction.actionId);
    case 'UpdateDrawingRemoveDate':
      return new UpdateDrawingRemoveDateAction(remoteAction.action.payload, remoteAction.actionId);

    default:
      throw new Error(`Unknown remote action '${remoteAction.action.type}'`) as never;
  }
}
