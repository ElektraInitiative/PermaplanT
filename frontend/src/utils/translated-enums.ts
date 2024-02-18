import { useTranslation } from 'react-i18next';
import { Quality, Quantity } from '@/api_types/definitions';

export function useTranslatedQuality(): Record<Quality, string> {
  // The record return type ensures that all the keys are present in the returned object.
  const { t } = useTranslation(['enums']);

  return {
    [Quality.NotOrganic]: t('enums:Quality.NotOrganic'),
    [Quality.Organic]: t('enums:Quality.Organic'),
    [Quality.Unknown]: t('enums:Quality.Unknown'),
  };
}

export function useTranslatedQuantity(): Record<Quantity, string> {
  const { t } = useTranslation(['enums']);

  return {
    [Quantity.Nothing]: t(`enums:Quantity.Nothing`),
    [Quantity.NotEnough]: t('enums:Quantity.NotEnough'),
    [Quantity.Enough]: t('enums:Quantity.Enough'),
    [Quantity.MoreThanEnough]: t('enums:Quantity.MoreThanEnough'),
  };
}
