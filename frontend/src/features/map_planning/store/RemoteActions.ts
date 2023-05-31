import { CreatePlantAction, DeletePlantAction } from '../layers/plant/actions';
import useMapStore from './MapStore';
import { Action } from './MapStoreTypes';
import { CreatePlantActionDto, DeletePlantActionDto } from '@/bindings/definitions';
import { User } from 'oidc-client-ts';
import z from 'zod';

export function handleRemoteAction(ev: MessageEvent<unknown>, user: User) {
  if (typeof ev.data !== 'string') {
    console.error('Received non-string message from server');
    return;
  }

  let remoteAction: RemoteAction;
  try {
    const remoteActionJson = JSON.parse(ev.data);
    remoteAction = RemoteActionSchema.parse(remoteActionJson);
  } catch (e) {
    console.error(e);
    return;
  }

  if (remoteAction.userId === user.profile.sub) {
    // Ignore actions from self, later this can be used to handle conflicts.
    // see https://www.figma.com/blog/how-figmas-multiplayer-technology-works/#syncing-object-properties
    return;
  }

  const action = convertToAction(remoteAction);

  useMapStore.getState().__applyRemoteAction(action);
}

function convertToAction(remoteAction: RemoteAction): Action<unknown, unknown> {
  switch (remoteAction.type) {
    case 'CREATE_PLANT':
      return new CreatePlantAction({
        ...remoteAction.payload,
      });
    case 'DELETE_PLANT':
      return new DeletePlantAction(remoteAction.payload.id);
    default:
      throw new Error(`Unknown remote action`) as never;
  }
}

const RemoteCreatePlantActionSchema = z.object({
  type: z.literal('CREATE_PLANT'),
  userId: z.string(),
  payload: z.object({
    id: z.string(),
    plantId: z.number(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    rotation: z.number(),
    scaleX: z.number(),
    scaleY: z.number(),
  }),
}) satisfies z.ZodType<CreatePlantActionDto>;

const RemoteDeletePlantActionSchema = z.object({
  type: z.literal('DELETE_PLANT'),
  userId: z.string(),
  payload: z.object({
    id: z.string(),
  }),
}) satisfies z.ZodType<DeletePlantActionDto>;

const RemoteActionSchema = z.discriminatedUnion('type', [
  RemoteCreatePlantActionSchema,
  RemoteDeletePlantActionSchema,
]);

type RemoteAction = z.infer<typeof RemoteActionSchema>;
