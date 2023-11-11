import { UpdateBaseLayerAction } from '../../../layers/base/actions';
import { BaseLayerImageDto } from '@/api_types/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import ModalContainer from '@/components/Modals/ModalContainer';
import { calculateDistance, calculateScale } from '@/features/map_planning/layers/base/util';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useIsReadOnlyMode } from '@/features/map_planning/utils/ReadOnlyModeContext';
import FileSelectorModal from '@/features/nextcloud_integration/components/FileSelectorModal';
import { useDebouncedSubmit } from '@/hooks/useDebouncedSubmit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FileStat } from 'webdav';
import { z } from 'zod';

export type BaseLayerDataAttributes = Pick<BaseLayerImageDto, 'path' | 'rotation' | 'scale'>;

const BaseLayerRightToolbarFormSchema = z.object({
  path: z.nullable(z.string()).transform((value) => value ?? ''),
  rotation: z.number().transform((value) => value % 360),
  scale: z.number().min(0),
});

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

export const TEST_IDS = Object.freeze({
  BACKGROUND_INPUT: 'base-layer-right-toolbar__background-input',
  ROTATION_INPUT: 'base-layer-right-toolbar__rotation-input',
  SCALE_INPUT: 'base-layer-right-toolbar__scale-input',
});

class ValidationError extends Error {
  constructor(msg: string) {
    super(msg);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

function validateBaseLayerOptions(baseLayerOptions: Omit<BaseLayerImageDto, 'action_id'>) {
  const { id, layer_id, path, rotation, scale } = baseLayerOptions;
  if (!id) {
    console.error(new ValidationError('BaseLayer validation error: id is invalid'));
    return false;
  }
  if (!layer_id) {
    console.error(new ValidationError('BaseLayer validation error: layer_id is invalid'));
    return false;
  }
  if (!path) {
    console.error(new ValidationError('BaseLayer validation error: path is invalid'));
    return false;
  }
  if (rotation === undefined || rotation === null) {
    console.error(new ValidationError('BaseLayer validation error: rotation is invalid'));
    return false;
  }
  if (scale === undefined || scale === null) {
    console.error(new ValidationError('BaseLayer validation error: scale is invalid'));
    return false;
  }

  return true;
}

export const BaseLayerRightToolbar = () => {
  const baseLayerState = useMapStore((state) => state.trackedState.layers.base);
  const { measureStep, measurePoint1, measurePoint2 } = useMapStore(
    (state) => state.untrackedState.layers.base,
  );
  const executeAction = useMapStore((state) => state.executeAction);
  const activateMeasurement = useMapStore((state) => state.baseLayerActivateMeasurement);
  const deactivateMeasurement = useMapStore((state) => state.baseLayerDeactivateMeasurement);
  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);
  const clearStatusPanelContent = useMapStore((state) => state.clearStatusPanelContent);

  const { t } = useTranslation(['common', 'baseLayerForm']);
  const isReadOnlyMode = useIsReadOnlyMode();

  const sendBaseLayerState = ({ scale, rotation, path }: BaseLayerDataAttributes) => {
    const baseLayerOptions = {
      id: baseLayerState.imageId,
      layer_id: baseLayerState.layerId,
      path: path,
      rotation: rotation,
      scale: scale,
    };

    if (validateBaseLayerOptions(baseLayerOptions))
      executeAction(new UpdateBaseLayerAction(baseLayerOptions));
  };

  const { register, handleSubmit, watch, setValue, formState } = useForm<BaseLayerDataAttributes>({
    defaultValues: {
      scale: baseLayerState.scale,
      rotation: baseLayerState.rotation,
      path: baseLayerState.nextcloudImagePath,
    },
    resolver: zodResolver(BaseLayerRightToolbarFormSchema),
  });

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scaleSubmitState = useDebouncedSubmit<BaseLayerDataAttributes>(
    watch('scale'),
    handleSubmit,
    sendBaseLayerState,
  );

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rotationSubmitState = useDebouncedSubmit<BaseLayerDataAttributes>(
    watch('rotation'),
    handleSubmit,
    sendBaseLayerState,
  );

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pathSubmitState = useDebouncedSubmit<BaseLayerDataAttributes>(
    watch('path'),
    handleSubmit,
    sendBaseLayerState,
  );
  const [showFileSelector, setShowFileSelector] = useState(false);

  const onDistModalSubmit: SubmitHandler<BaseLayerDistanceModalAttributes> = (attributes) => {
    clearStatusPanelContent();

    const point1 = measurePoint1 ?? { x: 0, y: 0 };
    const point2 = measurePoint2 ?? { x: 0, y: 0 };

    const measuredDistance = calculateDistance(point1, point2);
    const actualDistance = attributes.meters * 100 + attributes.centimeters;
    if (actualDistance === 0) {
      toast.error(t('baseLayerForm:error_actual_distance_zero'));
      return;
    }

    const scale = calculateScale(measuredDistance, baseLayerState.scale, actualDistance);
    setValue('scale', scale);

    deactivateMeasurement();
  };

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
    <div className="flex flex-col gap-2 p-2">
      <ModalContainer show={measureStep === 'both selected'}>
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
          <div className="flex flex-row gap-2">
            <SimpleFormInput
              id="meters"
              className="w-min"
              labelText={t('common:meters')}
              type="number"
              register={registerDistanceModal}
              min="0"
            />
            <SimpleFormInput
              id="centimeters"
              className="w-min"
              labelText={t('common:centimeters')}
              type="number"
              register={registerDistanceModal}
              min="0"
              max="99"
            />
          </div>
          <div className="flex flex-row items-end gap-2">
            <SimpleButton onClick={() => deactivateMeasurement()}>
              {t('common:cancel')}
            </SimpleButton>
            <SimpleButton onClick={handleSubmitDistanceModal(onDistModalSubmit)}>
              {t('common:ok')}
            </SimpleButton>
          </div>
        </div>
      </ModalContainer>
      <h2>{t('baseLayerForm:title')}</h2>
      <SimpleFormInput
        id="path"
        disabled={isReadOnlyMode}
        labelText={t('baseLayerForm:image_path_field')}
        data-testid={TEST_IDS.BACKGROUND_INPUT}
        register={register}
      />
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

      <SimpleButton onClick={() => setShowFileSelector(true)} disabled={isReadOnlyMode}>
        {t('baseLayerForm:selectImage')}
      </SimpleButton>
      <SimpleFormInput
        id="rotation"
        register={register}
        disabled={isReadOnlyMode}
        labelText={t('baseLayerForm:rotation_field')}
        type="number"
        data-testid={TEST_IDS.ROTATION_INPUT}
      />
      <div className="flex flex-col gap-2">
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
};

export default BaseLayerRightToolbar;
