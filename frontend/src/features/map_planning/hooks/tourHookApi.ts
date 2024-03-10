import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { errorToastGrouped } from '@/features/toasts/groupedToast';
import { getTourStatus } from '../api/getTourStatus';
import { updateTourStatus } from '../api/updateTourStatus';

const TOUR_KEYS = {
  _helpers: {
    all: [{ entity: 'tour' }] as const,
    status: () => [{ ...TOUR_KEYS._helpers.all[0], scope: 'status' }] as const,
  },
  status: () => [{ ...TOUR_KEYS._helpers.status()[0] }] as const,
};

/**
 * Get the status of the guided tour.
 */
export function useTourStatus() {
  const { t } = useTranslation(['guidedTour']);

  return useQuery({
    queryKey: TOUR_KEYS.status(),
    queryFn: getTourStatus,
    refetchOnWindowFocus: false,
    meta: {
      errorMessage: t('guidedTour:fetch_status_error'),
    },
  });
}

/**
 * Re-enable the guided tour.
 */
export function useReenableTour() {
  const queryClient = useQueryClient();
  const { t } = useTranslation(['guidedTour']);

  return useMutation({
    mutationFn: () => updateTourStatus({ editor_tour_completed: false }),
    onError: () => {
      errorToastGrouped(t('guidedTour:update_tour_status_error'));
    },
    onSuccess: () => queryClient.invalidateQueries(TOUR_KEYS.status()),
  });
}

/**
 * Complete the guided tour.
 */
export function useCompleteTour() {
  const queryClient = useQueryClient();
  const { t } = useTranslation(['guidedTour']);

  return useMutation({
    mutationFn: () => updateTourStatus({ editor_tour_completed: true }),
    onError: () => {
      errorToastGrouped(t('guidedTour:complete_tour_error'));
    },
    onSuccess: () => queryClient.invalidateQueries(TOUR_KEYS.status()),
  });
}
