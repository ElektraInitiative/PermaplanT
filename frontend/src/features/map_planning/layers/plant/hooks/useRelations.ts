import { getRelations } from '../api/getRelations';
import { RelationDto } from '@/api_types/definitions';
import { useQuery } from '@tanstack/react-query';

export function useRelations(mapId: number, plantId: number, enabled = true) {
  return useQuery({
    queryKey: ['relations', { mapId, plantId }],
    queryFn: () => getRelations(mapId, plantId),
    enabled,
    select: (data) => {
      const map = new Map<number, RelationDto>();
      data.relations.forEach((r) => map.set(r.id, r));
      return map;
    },
  });
}
