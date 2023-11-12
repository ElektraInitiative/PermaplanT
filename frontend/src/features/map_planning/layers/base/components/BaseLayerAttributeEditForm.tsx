import { BaseLayerImageDto } from '@/api_types/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import useMapStore from '@/features/map_planning/store/MapStore';
import FileSelectorModal from '@/features/nextcloud_integration/components/FileSelectorModal';
import { useDebouncedSubmit } from '@/hooks/useDebouncedSubmit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FileStat } from 'webdav';
import { z } from 'zod';

export const TEST_IDS = Object.freeze({
  BACKGROUND_INPUT: 'base-layer-right-toolbar__background-input',
  ROTATION_INPUT: 'base-layer-right-toolbar__rotation-input',
  SCALE_INPUT: 'base-layer-right-toolbar__scale-input',
});

export type BaseLayerAttributeEditFormDataAttributes = Pick<
  BaseLayerImageDto,
  'path' | 'rotation' | 'scale'
>;

const BaseLayerAttributeEditFormSchema = z.object({
  path: z.nullable(z.string()).transform((value) => value ?? ''),
  rotation: z.number().transform((value) => value % 360),
  scale: z.number().min(0),
});

export interface BaseLayerEditFormProps {
  onChange: (data: BaseLayerAttributeEditFormDataAttributes) => void;
  isReadOnlyMode: boolean;
}

export function BaseLayerAttributeEditForm({ onChange, isReadOnlyMode }: BaseLayerEditFormProps) {
  const { t } = useTranslation(['common', 'baseLayerForm']);

  const activateMeasurement = useMapStore((state) => state.baseLayerActivateMeasurement);
  const deactivateMeasurement = useMapStore((state) => state.baseLayerDeactivateMeasurement);
  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);
  const clearStatusPanelContent = useMapStore((state) => state.clearStatusPanelContent);
  const measureStep = useMapStore((state) => state.untrackedState.layers.base.measureStep);
  const baseLayerState = useMapStore((state) => state.trackedState.layers.base);

  const { register, handleSubmit, watch, setValue, formState } =
    useForm<BaseLayerAttributeEditFormDataAttributes>({
      values: {
        scale: baseLayerState.scale,
        rotation: baseLayerState.rotation,
        path: baseLayerState.nextcloudImagePath,
      },
      resolver: zodResolver(BaseLayerAttributeEditFormSchema),
    });

  useDebouncedSubmit<BaseLayerAttributeEditFormDataAttributes>(
    watch('scale'),
    handleSubmit,
    onChange,
  );
  useDebouncedSubmit<BaseLayerAttributeEditFormDataAttributes>(
    watch('rotation'),
    handleSubmit,
    onChange,
  );
  useDebouncedSubmit<BaseLayerAttributeEditFormDataAttributes>(
    watch('path'),
    handleSubmit,
    onChange,
  );

  const [showFileSelector, setShowFileSelector] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <h2>{t('baseLayerForm:title')}</h2>
      <FileSelectorModal
        setShow={function (show: boolean): void {
          setShowFileSelector(show);
        }}
        show={showFileSelector}
        onCancel={function (): void {
          setShowFileSelector(false);
        }}
        path={'/Photos/'}
        onSelect={function (item: FileStat): void {
          const path = '/Photos/' + item.basename;
          setValue('path', path);
          setShowFileSelector(false);
        }}
        title={t('baseLayerForm:selectImage')}
      />
      <div className="flex flex-col gap-1">
        <SimpleFormInput
          id="path"
          disabled={isReadOnlyMode}
          labelText={t('baseLayerForm:image_path_field')}
          data-testid={TEST_IDS.BACKGROUND_INPUT}
          register={register}
        />

        <SimpleButton onClick={() => setShowFileSelector(true)} disabled={isReadOnlyMode}>
          {t('baseLayerForm:selectImage')}
        </SimpleButton>
      </div>
      <SimpleFormInput
        id="rotation"
        register={register}
        disabled={isReadOnlyMode}
        labelText={t('baseLayerForm:rotation_field')}
        type="number"
        data-testid={TEST_IDS.ROTATION_INPUT}
      />
      <div className="flex flex-col gap-1">
        <SimpleFormInput
          id="scale"
          register={register}
          disabled={isReadOnlyMode}
          labelText={t('baseLayerForm:scale')}
          type="number"
          data-testid={TEST_IDS.SCALE_INPUT}
        />
        {formState.errors.scale && (
          <div className="text-sm text-red-400">{t('baseLayerForm:scale_invalid')}</div>
        )}
        {measureStep === 'inactive' ? (
          <SimpleButton
            disabled={isReadOnlyMode}
            onClick={() => {
              activateMeasurement();
              setStatusPanelContent(<span>{t('baseLayerForm:auto_scaling_hint')}</span>);
            }}
          >
            {t('baseLayerForm:set_scale')}
          </SimpleButton>
        ) : (
          <SimpleButton
            onClick={() => {
              deactivateMeasurement();
              clearStatusPanelContent();
            }}
          >
            {t('common:cancel')}
          </SimpleButton>
        )}
      </div>
    </div>
  );
}
