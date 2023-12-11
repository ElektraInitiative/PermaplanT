import { getTourStatus } from '../api/getTourStatus';
import { updateTourStatus } from '../api/updateTourStatus';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

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
      autoClose: false,
    },
  });
}

/**
 * Re-enable the guided tour.
 */
export function useReenableTour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => updateTourStatus({ editor_tour_completed: false }),
    onError: () => {
      // TODO toast
      console.error('Failed to re-enable guided tour');
    },
    onSuccess: () => queryClient.invalidateQueries(TOUR_KEYS.status()),
  });
}

/**
 * Complete the guided tour.
 */
export function useCompleteTour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => updateTourStatus({ editor_tour_completed: true }),
    onError: () => {
      // TODO toast
      console.error('Failed to complete guided tour');
    },
    onSuccess: () => queryClient.invalidateQueries(TOUR_KEYS.status()),
  });
}
