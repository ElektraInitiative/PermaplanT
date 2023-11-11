import { getTourStatus } from '../api/getTourStatus';
import { GuidedToursDto } from '@/api_types/definitions';
import { errorToastGrouped } from '@/features/toasts/groupedToast';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useTourStatus(setStatus: (status: GuidedToursDto) => void) {
  const { t } = useTranslation(['guidedTour']);

  useEffect(() => {
    const _getStatus = async () => {
      const data = await getTourStatus();
      setStatus(data);
    };
    try {
      _getStatus();
    } catch (error) {
      console.error(error);
      errorToastGrouped(t('guidedTour:fetch_status_error'), { autoClose: false });
    }
  }, [setStatus, t]);
}
