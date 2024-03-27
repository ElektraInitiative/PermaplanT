import { useTranslation } from 'react-i18next';
import { Quantity } from '@/api_types/definitions';

/**
 * Returns a function that translates values of the Quantity enum.
 */
export function useTranslateQuantity() {
  const { t } = useTranslation('enums', { keyPrefix: 'Quantity' });

  return (key: Quantity) => {
    // We use a switch case here to avoid having to fight with
    // the type system.
    switch (key) {
      case 'nothing':
        return t('Nothing');
      case 'not enough':
        return t('NotEnough');
      case 'enough':
        return t('Enough');
      case 'more than enough':
        return t('MoreThanEnough');
      default:
        throw 'Unknown enum key';
    }
  };
}
