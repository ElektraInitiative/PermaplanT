import { getRelations } from '../api/getRelations';
import { RelationDto, RelationsDto } from '@/api_types/definitions';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

const RELATION_KEYS = {
  _helpers: {
    all: [{ entity: 'relations' }] as const,
    details: () => [{ ...RELATION_KEYS._helpers.all[0], scope: 'detail' }] as const,
  },
  detail: (mapId: number, plantId: number) =>
    [{ ...RELATION_KEYS._helpers.details()[0], mapId, plantId }] as const,
};

export function useRelations({ mapId, plantId, enabled = true }: UseRelationsArgs) {
  return useQuery({
    queryKey: RELATION_KEYS.detail(mapId, plantId),
    queryFn: getRelationsQueryFn,
    enabled,
    select: mapRelationToMap,
    // TODO: add error messages
  });
}

type UseRelationsArgs = {
  mapId: number;
  plantId: number;
  enabled?: boolean;
};

function mapRelationToMap(data: RelationsDto) {
  const map = new Map<number, RelationDto>();
  data.relations.forEach((r) => map.set(r.id, r));
  return map;
}

function getRelationsQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof RELATION_KEYS)['detail']>>) {
  const { mapId, plantId } = queryKey[0];

  return getRelations(mapId, plantId);
}
