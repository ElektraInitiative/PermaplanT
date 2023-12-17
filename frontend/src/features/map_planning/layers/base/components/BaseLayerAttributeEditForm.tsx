import { BaseLayerImageDto } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import useMapStore from '@/features/map_planning/store/MapStore';
import FileSelectorModal from '@/features/nextcloud_integration/components/FileSelectorModal';
import { useFileExists } from '@/features/nextcloud_integration/hooks/useFileExists';
import { useDebouncedSubmit } from '@/hooks/useDebouncedSubmit';
import { ReactComponent as CheckIcon } from '@/svg/icons/check.svg';
import { ReactComponent as CircleDottedIcon } from '@/svg/icons/circle-dotted.svg';
import { ReactComponent as CloseIcon, ReactComponent as CrossIcon } from '@/svg/icons/close.svg';
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
  scale: z.number().min(1),
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
  const measureStep = useMapStore(
    (state) => state.untrackedState.layers.base.autoScale.measureStep,
  );
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

  const scaleSubmitState = useDebouncedSubmit<BaseLayerAttributeEditFormDataAttributes>(
    watch('scale'),
    handleSubmit,
    onChange,
  );
  const rotationSubmitState = useDebouncedSubmit<BaseLayerAttributeEditFormDataAttributes>(
    watch('rotation'),
    handleSubmit,
    onChange,
  );
  const pathSubmitState = useDebouncedSubmit<BaseLayerAttributeEditFormDataAttributes>(
    watch('path'),
    handleSubmit,
    onChange,
  );

  const [showFileSelector, setShowFileSelector] = useState(false);
  const { exists: imageExists, isLoading: checkingImage } = useFileExists(
    baseLayerState.nextcloudImagePath,
  );

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
          labelContent={
            <span className="flex flex-row gap-2">
              {t('baseLayerForm:image_path_field')}
              {pathSubmitState === 'loading' ||
                (checkingImage && (
                  <CircleDottedIcon className="h-5 w-5 animate-spin text-secondary-400" />
                ))}
              {!checkingImage && imageExists && pathSubmitState === 'idle' && (
                <CheckIcon
                  className="h-5 w-5 text-primary-400"
                  data-testid="base-layer-attribute-edit-form__background-image-file-path-idle"
                />
              )}
              {!checkingImage && !imageExists && pathSubmitState === 'idle' && (
                <CrossIcon className="h-5 w-5 text-red-500" />
              )}
            </span>
          }
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
        labelContent={
          <span className="flex flex-row gap-2">
            {t('baseLayerForm:rotation_field')}
            {rotationSubmitState === 'loading' && (
              <CircleDottedIcon className="h-5 w-5 animate-spin text-secondary-400" />
            )}
            {rotationSubmitState === 'idle' && (
              <CheckIcon
                className="h-5 w-5 text-primary-400"
                data-testid="base-layer-attribute-edit-form__rotation-idle"
              />
            )}
          </span>
        }
        type="number"
        data-testid={TEST_IDS.ROTATION_INPUT}
      />
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-1">
          <SimpleFormInput
            id="scale"
            register={register}
            disabled={isReadOnlyMode}
            labelContent={
              <span className="flex flex-row gap-2">
                {t('baseLayerForm:scale')}
                {scaleSubmitState === 'loading' && (
                  <CircleDottedIcon className="h-5 w-5 animate-spin text-secondary-400" />
                )}
                {scaleSubmitState === 'idle' && (
                  <CheckIcon
                    className="h-5 w-5 text-primary-400"
                    data-testid="base-layer-attribute-edit-form__scale-idle"
                  />
                )}
              </span>
            }
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
                setStatusPanelContent(
                  <>
                    <div className="flex flex-row items-center justify-center">
                      {t('baseLayerForm:auto_scaling_hint')}
                    </div>
                    <div className="flex items-center justify-center">
                      <IconButton
                        className="m-2 h-8 w-8 border border-neutral-500 p-1"
                        onClick={() => {
                          deactivateMeasurement();
                          clearStatusPanelContent();
                        }}
                        data-tourid="placement_cancel"
                      >
                        <CloseIcon></CloseIcon>
                      </IconButton>
                    </div>
                  </>,
                );
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
    </div>
  );
}
