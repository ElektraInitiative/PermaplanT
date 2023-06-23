import { UpdateBaseLayerAction } from '../../../layers/base/actions';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import ModalContainer from '@/components/Modals/ModalContainer';
import useMapStore from '@/features/map_planning/store/MapStore';
import { MAP_PIXELS_PER_METER } from '@/features/map_planning/utils/Constants';
import { Vector2d } from 'konva/lib/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const calculateScale = (
  measuredDistancePixels: number,
  actualDistanceCentimeters: number,
): number => {
  return Math.floor((measuredDistancePixels / actualDistanceCentimeters) * MAP_PIXELS_PER_METER);
};

const calculateDistance = (point1: Vector2d, point2: Vector2d) => {
  const lengthX = Math.abs(point2.x - point1.x);
  const lengthY = Math.abs(point2.y - point1.y);
  return Math.sqrt(lengthX * lengthX + lengthY * lengthY);
};

const BaseLayerRightToolbar = () => {
  const trackedState = useMapStore((state) => state.trackedState.layers.Base);
  const untrackedState = useMapStore((state) => state.untrackedState.layers.Base);
  const executeAction = useMapStore((state) => state.executeAction);
  const activateMeasurement = useMapStore((state) => state.baseLayerActivateMeasurement);
  const deactivateMeasurement = useMapStore((state) => state.baseLayerDeactivateMeasurement);

  const { t } = useTranslation(['common', 'baseLayerForm']);

  const [rotationInput, setRotationInput] = useState(trackedState.rotation);
  const [scaleInput, setScaleInput] = useState(trackedState.scale);
  const [pathInput, setPathInput] = useState(trackedState.nextcloudImagePath);

  useEffect(() => {
    setRotationInput(trackedState.rotation);
    setScaleInput(trackedState.scale);
    setPathInput(trackedState.nextcloudImagePath);
  }, [trackedState.nextcloudImagePath, trackedState.scale, trackedState.rotation]);

  const [distMeters, setDistMeters] = useState(0);
  const [distCentimeters, setDistCentimeters] = useState(0);

  const onDistModalSubmit = () => {
    console.assert(untrackedState.measurePoint1 !== null);
    console.assert(untrackedState.measurePoint2 !== null);

    const point1 = untrackedState.measurePoint1 ?? { x: 0, y: 0 };
    const point2 = untrackedState.measurePoint2 ?? { x: 0, y: 0 };

    const measuredDistance = calculateDistance(point1, point2);
    const actualDistance = distMeters * 100 + distCentimeters;
    if (actualDistance === 0) {
      toast.error(t('baseLayerForm:error_actual_distance_zero'));
      return;
    }
    setScaleInput(calculateScale(measuredDistance, actualDistance));
    deactivateMeasurement();
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <ModalContainer show={untrackedState.measureStep === 'both selected'}>
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
        onChange={(e) => setPathInput(e.target.value)}
        value={pathInput}
      />
      <SimpleFormInput
        id="rotation"
        labelText={t('baseLayerForm:rotation_field')}
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
          onChange={(e) => setScaleInput(parseInt(e.target.value))}
          type="number"
          value={scaleInput}
          min="0"
        />
        <SimpleButton
          onClick={() =>
            untrackedState.measureStep === 'inactive'
              ? activateMeasurement()
              : deactivateMeasurement()
          }
        >
          {untrackedState.measureStep === 'inactive'
            ? t('baseLayerForm:set_scale')
            : t('common:cancel')}
        </SimpleButton>
      </div>
      <SimpleButton
        onClick={() =>
          executeAction(new UpdateBaseLayerAction(rotationInput, scaleInput, pathInput))
        }
      >
        {t('common:apply')}
      </SimpleButton>
    </div>
  );
};

export default BaseLayerRightToolbar;
