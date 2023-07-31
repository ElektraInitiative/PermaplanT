import { getTourStatus } from '../api/getTourStatus';
import { GuidedToursDto } from '@/bindings/definitions';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

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
      toast.error(t('guidedTour:fetch_status_error'), { autoClose: false });
    }
  }, [setStatus, t]);
}
