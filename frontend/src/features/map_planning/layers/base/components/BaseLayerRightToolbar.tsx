import { UpdateBaseLayerAction } from '../../../layers/base/actions';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import ModalContainer from '@/components/Modals/ModalContainer';
import useMapStore from '@/features/map_planning/store/MapStore';
import { Vector2d } from 'konva/lib/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const calculateScale = (
  measuredDistancePixels: number,
  oldScale: number,
  actualDistanceCentimeters: number,
): number => {
  if (oldScale === 0 || actualDistanceCentimeters === 0) return 0;
  return Math.floor(measuredDistancePixels / (actualDistanceCentimeters / oldScale));
};

export const calculateDistance = (point1: Vector2d, point2: Vector2d) => {
  const lengthX = Math.abs(point2.x - point1.x);
  const lengthY = Math.abs(point2.y - point1.y);
  return Math.sqrt(lengthX * lengthX + lengthY * lengthY);
};

export const BaseLayerRightToolbar = () => {
  const baseLayerState = useMapStore((state) => state.trackedState.layers.base);
  const {measureStep, measurePoint1, measurePoint2} = useMapStore((state) => state.untrackedState.layers.base);
  const executeAction = useMapStore((state) => state.executeAction);
  const activateMeasurement = useMapStore((state) => state.baseLayerActivateMeasurement);
  const deactivateMeasurement = useMapStore((state) => state.baseLayerDeactivateMeasurement);

  console.log(measureStep);

  const { t } = useTranslation(['common', 'baseLayerForm']);

  // React either requires a defaultValue or value plus onChange props on an input field.
  //
  // Therefore, this seems to be the only way to keep track of external state changes to the file path while
  // using the onFocusEvent handler to update the state from this component.
  const [pathInput, setPathInput] = useState(baseLayerState.nextcloudImagePath);
  const [rotationInput, setRotationInput] = useState(baseLayerState.rotation);
  const [scaleInput, setScaleInput] = useState(baseLayerState.rotation);
  useEffect(() => {
    setPathInput(baseLayerState.nextcloudImagePath);
    setScaleInput(baseLayerState.scale);
    setRotationInput(baseLayerState.rotation);
  }, [baseLayerState.nextcloudImagePath, baseLayerState.scale, baseLayerState.rotation]);

  const [distMeters, setDistMeters] = useState(0);
  const [distCentimeters, setDistCentimeters] = useState(0);

  const onDistModalSubmit = () => {
    console.assert(measurePoint1 !== null);
    console.assert(measurePoint2 !== null);

    const point1 = measurePoint1 ?? { x: 0, y: 0 };
    const point2 = measurePoint2 ?? { x: 0, y: 0 };

    const measuredDistance = calculateDistance(point1, point2);
    const actualDistance = distMeters * 100 + distCentimeters;
    if (actualDistance === 0) {
      toast.error(t('baseLayerForm:error_actual_distance_zero'));
      return;
    }

    const scale = calculateScale(measuredDistance, baseLayerState.scale, actualDistance);
    const path = baseLayerState.nextcloudImagePath;
    const rotation = baseLayerState.rotation;
    executeAction(new UpdateBaseLayerAction(rotation, scale, path));

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
        labelText={t('baseLayerForm:image_path_field')}
        onBlur={(e) => {
          const scale = baseLayerState.scale;
          const path = e.target.value;
          const rotation = baseLayerState.rotation;
          executeAction(new UpdateBaseLayerAction(rotation, scale, path));
        }}
        onChange={(e) => setPathInput(e.target.value)}
        value={pathInput}
      />
      <SimpleFormInput
        id="rotation"
        labelText={t('baseLayerForm:rotation_field')}
        onBlur={(e) => {
          const scale = baseLayerState.scale;
          const path = baseLayerState.nextcloudImagePath;
          const rotation = parseInt(e.target.value);
          executeAction(new UpdateBaseLayerAction(rotation, scale, path));
        }}
        onChange={(e) => setRotationInput(parseInt(e.target.value))}
        type="number"
        value={rotationInput}
        min="0"
        max="359"
      />
      <div className="flex flex-row items-end gap-2">
        <SimpleFormInput
          id="scale"
          labelText={t('baseLayerForm:scale')}
          onBlur={(e) => {
            const scale = parseInt(e.target.value);
            const path = baseLayerState.nextcloudImagePath;
            const rotation = baseLayerState.rotation;
            executeAction(new UpdateBaseLayerAction(rotation, scale, path));
          }}
          onChange={(e) => setScaleInput(parseInt(e.target.value))}
          type="number"
          value={scaleInput}
          min="0"
        />
        <SimpleButton
          onClick={() =>
            measureStep === 'inactive'
              ? activateMeasurement()
              : deactivateMeasurement()
          }
        >
          {measureStep === 'inactive'
            ? t('baseLayerForm:set_scale')
            : t('common:cancel')}
        </SimpleButton>
      </div>
    </div>
  );
};

export default BaseLayerRightToolbar;
