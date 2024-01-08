import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import ModalContainer from '@/components/Modals/ModalContainer';

export type BaseLayerDistanceModalAttributes = {
  meters: number;
  centimeters: number;
};

const BaseLayerDistanceModalFormSchema = z.object({
  meters: z
    .number()
    .min(0)
    .transform((value) => value),
  centimeters: z
    .number()
    .min(0)
    .max(99)
    .transform((value) => value),
});

interface DistanceMeasurementModalProps {
  onSubmit: SubmitHandler<BaseLayerDistanceModalAttributes>;
  onCancel: () => void;
  show: boolean;
}

export function DistanceMeasurementModal({
  onSubmit,
  onCancel,
  show,
}: DistanceMeasurementModalProps) {
  const { t } = useTranslation(['common', 'baseLayerForm']);

  const {
    register: registerDistanceModal,
    handleSubmit: handleSubmitDistanceModal,
    formState: registerDistanceModalFormState,
  } = useForm<BaseLayerDistanceModalAttributes>({
    defaultValues: {
      meters: 0,
      centimeters: 0,
    },
    resolver: zodResolver(BaseLayerDistanceModalFormSchema),
  });

  return (
    <ModalContainer show={show}>
      <div className="w-ful flex h-full min-h-[20vh] flex-col gap-2 rounded-lg bg-neutral-100 p-6 dark:bg-neutral-100-dark">
        <h3>{t('baseLayerForm:distance_modal_title')}</h3>
        {registerDistanceModalFormState.errors.meters && (
          <div className="text-sm text-red-400">
            {t('baseLayerForm:auto_scaling_meters_invalid')}
          </div>
        )}
        {registerDistanceModalFormState.errors.centimeters && (
          <div className="text-sm text-red-400">
            {t('baseLayerForm:auto_scaling_centimeters_invalid')}
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <SimpleFormInput
            id="meters"
            labelContent={t('common:meters')}
            type="number"
            register={registerDistanceModal}
            min="0"
          />
          <SimpleFormInput
            id="centimeters"
            labelContent={t('common:centimeters')}
            type="number"
            register={registerDistanceModal}
            min="0"
            max="99"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SimpleButton onClick={() => onCancel()}>{t('common:cancel')}</SimpleButton>
          <SimpleButton onClick={handleSubmitDistanceModal(onSubmit)}>
            {t('common:ok')}
          </SimpleButton>
        </div>
      </div>
    </ModalContainer>
  );
}
