import SimpleButton from '@/components/Button/SimpleButton';
import SelectMenu from '@/components/Form/SelectMenu';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export function ShadeLayerRightToolbar() {
  const { t } = useTranslation('shadeLayer');
  const { control } = useForm();

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <SelectMenu
        id="shade-amount"
        labelText={t('left_toolbar.shading_amount_select_title')}
        className="w-64"
        control={control}
        options={[
          { value: '', label: t('shading_amount.light_shade') },
          { value: '', label: t('shading_amount.partial_shade') },
          { value: '', label: t('shading_amount.permanent_shade') },
          { value: '', label: t('shading_amount.permanent_deep_shade') },
        ]}
      />
      <SimpleButton className="mb-32">{t('right_toolbar.add_shading')}</SimpleButton>
    </div>
  );
}
