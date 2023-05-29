import z from 'zod';

export const RemoteActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('CREATE_PLANT'),
    payload: z.object({
      id: z.string(),
      plant_id: z.number(),
      x: z.number(),
      y: z.number(),
    }),
  }),
  z.object({
    type: z.literal('DELETE_PLANT'),
    payload: z.object({
      id: z.string(),
    }),
  }),
]);

export type RemoteAction = z.infer<typeof RemoteActionSchema>;
