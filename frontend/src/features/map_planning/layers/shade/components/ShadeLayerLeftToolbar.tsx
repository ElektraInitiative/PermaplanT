import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import SelectMenu from '@/components/Form/SelectMenu';
import { ShadingGeometryToolForm } from '@/features/map_planning/layers/shade/components/ShadingGeometryToolForm';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export function ShadeLayerLeftToolbar() {
  const { t } = useTranslation('shadeLayer');

  const { control } = useForm();
  return (
    <div className="flex flex-col gap-2 p-2">
      <SelectMenu
        id="shade-amount"
        labelText={t('left_toolbar.shading_amount_select_title')}
        control={control}
        options={[
          { value: '', label: t('shading_amount.light_shade') },
          { value: '', label: t('shading_amount.partial_shade') },
          { value: '', label: t('shading_amount.permanent_shade') },
          { value: '', label: t('shading_amount.permanent_deep_shade') },
        ]}
      />
      <ShadingGeometryToolForm />
      <SimpleButton variant={ButtonVariant.dangerBase} className="top-5">
        {t('left_toolbar.delete_button')}
      </SimpleButton>
    </div>
  );
}
