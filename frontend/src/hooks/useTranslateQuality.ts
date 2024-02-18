import { useTranslation } from 'react-i18next';
import { Quality } from '@/api_types/definitions';

/**
 * Returns a function that translates values of the Quality enum.
 */
export function useTranslateQuality() {
  const { t } = useTranslation('enums', { keyPrefix: 'Quality' });

  return (key: Quality) => {
    // We use a switch case here to avoid having to fight with
    // the type system.
    switch (key) {
      case 'organic':
        return t('Organic');
      case 'not organic':
        return t('NotOrganic');
      case 'unknown':
        return t('Unknown');
      default:
        throw 'Unknown enum key';
    }
  };
}
