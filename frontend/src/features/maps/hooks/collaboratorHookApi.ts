import { QueryFunctionContext, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DeleteMapCollaboratorDto, NewMapCollaboratorDto } from '@/api_types/definitions';
import { errorToastGrouped } from '@/features/toasts/groupedToast';
import { addCollaborator } from '../api/addCollaborator';
import { findCollaborators } from '../api/findCollaborators';
import { removeCollaborator } from '../api/removeCollaborator';

const COLLABORATOR_KEYS = {
  _helpers: {
    all: [{ entity: 'collaborator' }] as const,
    details: () => [{ ...COLLABORATOR_KEYS._helpers.all[0], scope: 'detail' }] as const,
  },
  detail: (mapId: number) => [{ ...COLLABORATOR_KEYS._helpers.details(), mapId }] as const,
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

/**
 * Mutations
 */

/**
 * A mutation to add a collaborator to a map.
 */
export function useAddCollaborator() {
  // const { t } = useTranslation(['']);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCollaboratorMutationFn,
    onError: () => {
      errorToastGrouped('Error adding collaborator');
    },
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries(COLLABORATOR_KEYS.detail(variables.mapId)),
  });
}

const addCollaboratorMutationFn = ({ mapId, dto }: { mapId: number; dto: NewMapCollaboratorDto }) =>
  addCollaborator(mapId, dto);

export function useRemoveCollaborator() {
  // const { t } = useTranslation(['']);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCollaboratorMutationFn,
    onError: () => {
      errorToastGrouped('Error removing collaborator');
    },
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries(COLLABORATOR_KEYS.detail(variables.mapId)),
  });
}

const removeCollaboratorMutationFn = ({
  mapId,
  dto,
}: {
  mapId: number;
  dto: DeleteMapCollaboratorDto;
}) => removeCollaborator(mapId, dto);
