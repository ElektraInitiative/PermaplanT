import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { findCollaborators } from '../api/findCollaborators';

const COLLABORATOR_KEYS = {
  _helpers: {
    all: [{ entity: 'collaborator' }] as const,
    details: () => [{ ...COLLABORATOR_KEYS._helpers.all[0], scope: 'detail' }] as const,
  },
  detail: (mapId: number) => [{ ...COLLABORATOR_KEYS._helpers.details()[0], mapId }] as const,
};

/**
 * Load collaborators of a map.
 */
export function useFindCollaborators(mapId: number) {
  // TODO: translations
  // const { t } = useTranslation(['maps']);

  return useQuery({
    queryKey: COLLABORATOR_KEYS.detail(mapId),
    queryFn: findCollaboratorsQueryFn,
    meta: {
      errorMessage: 'Error fetching collaborators',
      autoClose: false,
      toastId: 'fetchError',
    },
  });
}

function findCollaboratorsQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof COLLABORATOR_KEYS)['detail']>>) {
  const { mapId } = queryKey[0];

  return findCollaborators(mapId);
}
