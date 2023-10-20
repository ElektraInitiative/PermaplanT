import { UpdateBaseLayerAction } from '../../../layers/base/actions';
import { BaseLayerImageDto } from '@/api_types/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import ModalContainer from '@/components/Modals/ModalContainer';
import { calculateDistance, calculateScale } from '@/features/map_planning/layers/base/util';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useIsReadOnlyMode } from '@/features/map_planning/utils/ReadOnlyModeContext';
import FileSelectorModal from '@/features/nextcloud_integration/components/FileSelectorModal';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FileStat } from 'webdav';

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

  const { t } = useTranslation(['common', 'baseLayerForm']);
  const isReadOnlyMode = useIsReadOnlyMode();

  // React either requires a defaultValue or value plus onChange props on an input field.
  //
  // Therefore, this seems to be the only way to keep track of external state changes to the file path while
  // using the onFocusEvent handler to update the state from this component.
  const [pathInput, setPathInput] = useState(baseLayerState.nextcloudImagePath);
  const [rotationInput, setRotationInput] = useState(baseLayerState.rotation);
  const [scaleInput, setScaleInput] = useState(baseLayerState.scale);
  const [showFileSelector, setShowFileSelector] = useState(false);

  useEffect(() => {
    setPathInput(baseLayerState.nextcloudImagePath);
  }, [baseLayerState.nextcloudImagePath]);

  useEffect(() => {
    setScaleInput(baseLayerState.scale);
  }, [baseLayerState.scale]);

  useEffect(() => {
    setRotationInput(baseLayerState.rotation);
  }, [baseLayerState.rotation]);

  const debouncedPath = useDebouncedValue(pathInput, 200);
  const debouncedRotation = useDebouncedValue(rotationInput, 200);
  const debouncedScale = useDebouncedValue(scaleInput, 200);

  useEffect(() => {
    const baseLayerOptions = {
      id: baseLayerState.imageId,
      layer_id: baseLayerState.layerId,
      path: debouncedPath,
      rotation: debouncedRotation,
      scale: debouncedScale,
    };
    if (validateBaseLayerOptions(baseLayerOptions))
      executeAction(new UpdateBaseLayerAction(baseLayerOptions));
  }, [
    baseLayerState.imageId,
    baseLayerState.layerId,
    debouncedPath,
    executeAction,
    debouncedScale,
    debouncedRotation,
  ]);

  const [distMeters, setDistMeters] = useState(0);
  const [distCentimeters, setDistCentimeters] = useState(0);

  const onDistModalSubmit = () => {
    const point1 = measurePoint1 ?? { x: 0, y: 0 };
    const point2 = measurePoint2 ?? { x: 0, y: 0 };

    const measuredDistance = calculateDistance(point1, point2);
    const actualDistance = distMeters * 100 + distCentimeters;
    if (actualDistance === 0) {
      toast.error(t('baseLayerForm:error_actual_distance_zero'));
      return;
    }

    const scale = calculateScale(measuredDistance, baseLayerState.scale, actualDistance);
    executeAction(
      new UpdateBaseLayerAction({
        id: baseLayerState.imageId,
        layer_id: baseLayerState.layerId,
        rotation: baseLayerState.rotation,
        scale,
        path: baseLayerState.nextcloudImagePath,
      }),
    );

    deactivateMeasurement();
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <ModalContainer show={measureStep === 'both selected'}>
        <div className="w-ful flex h-full min-h-[20vh] flex-col gap-2 rounded-lg bg-neutral-100 p-6 dark:bg-neutral-100-dark">
          <h3>{t('baseLayerForm:distance_modal_title')}</h3>
          <div className="flex flex-row gap-2">
            <SimpleFormInput
              id="dist_meters"
              className="w-min"
              labelText={t('common:meters')}
              onChange={(e) => setDistMeters(parseInt(e.target.value))}
              type="number"
              value={distMeters}
              min="0"
            />
            <SimpleFormInput
              id="dist_centimeters"
              className="w-min"
              labelText={t('common:centimeters')}
              onChange={(e) => setDistCentimeters(parseInt(e.target.value))}
              type="number"
              value={distCentimeters}
              min="0"
              max="99"
            />
          </div>
          <div className="flex flex-row items-end gap-2">
            <SimpleButton onClick={() => deactivateMeasurement()}>
              {t('common:cancel')}
            </SimpleButton>
            <SimpleButton onClick={() => onDistModalSubmit()}>{t('common:ok')}</SimpleButton>
          </div>
        </div>
      </ModalContainer>
      <h2>{t('baseLayerForm:title')}</h2>
      <SimpleFormInput
        id="file"
        disabled={isReadOnlyMode}
        labelText={t('baseLayerForm:image_path_field')}
        onChange={(e) => setPathInput(e.target.value)}
        value={pathInput}
        data-testid={TEST_IDS.BACKGROUND_INPUT}
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
          const scale = baseLayerState.scale;
          const path = '/Photos/' + item.basename;
          const rotation = baseLayerState.rotation;
          executeAction(
            new UpdateBaseLayerAction({
              id: baseLayerState.imageId,
              layer_id: baseLayerState.layerId,
              path: path,
              rotation: rotation,
              scale: scale,
            }),
          );
          setPathInput(path);
          setShowFileSelector(false);
        }}
      />

      <SimpleButton onClick={() => setShowFileSelector(true)} disabled={isReadOnlyMode}>
        {t('baseLayerForm:selectImage')}
      </SimpleButton>
      <SimpleFormInput
        id="rotation"
        disabled={isReadOnlyMode}
        labelText={t('baseLayerForm:rotation_field')}
        onChange={(e) => setRotationInput(parseInt(e.target.value))}
        type="number"
        value={rotationInput}
        min="0"
        max="359"
        data-testid={TEST_IDS.ROTATION_INPUT}
      />
      <div className="flex flex-row items-end gap-2">
        <SimpleFormInput
          id="scale"
          disabled={isReadOnlyMode}
          labelText={t('baseLayerForm:scale')}
          onChange={(e) => setScaleInput(parseInt(e.target.value))}
          type="number"
          value={scaleInput}
          min="0"
          data-testid={TEST_IDS.SCALE_INPUT}
        />
        {measureStep === 'inactive' ? (
          <SimpleButton onClick={() => activateMeasurement()}>
            {t('baseLayerForm:set_scale')}
          </SimpleButton>
        ) : (
          <SimpleButton onClick={() => deactivateMeasurement()}>{t('common:cancel')}</SimpleButton>
        )}
      </div>
    </div>
  );
};

export default BaseLayerRightToolbar;
