import { getTourStatus } from '../api/getTourStatus';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export function useTourStatus() {
  const { t } = useTranslation(['guidedTour']);

  const queryResponse = useQuery(['tour-status'], getTourStatus, {
    meta: {
      errorMessage: t('guidedTour:fetch_status_error'),
      autoClose: false,
    },
  });

  return queryResponse.data;
}
