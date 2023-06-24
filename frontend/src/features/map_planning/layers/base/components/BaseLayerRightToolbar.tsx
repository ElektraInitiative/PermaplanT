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
  console.log(measuredDistancePixels, oldScale, actualDistanceCentimeters);
  if (oldScale === 0 || actualDistanceCentimeters === 0) return 0;
  return Math.floor((measuredDistancePixels / oldScale) * actualDistanceCentimeters);
};

export const calculateDistance = (point1: Vector2d, point2: Vector2d) => {
  const lengthX = Math.abs(point2.x - point1.x);
  const lengthY = Math.abs(point2.y - point1.y);
  return Math.sqrt(lengthX * lengthX + lengthY * lengthY);
};

export const BaseLayerRightToolbar = () => {
  const trackedState = useMapStore((state) => state.trackedState.layers.Base);
  const untrackedState = useMapStore((state) => state.untrackedState.layers.Base);
  const executeAction = useMapStore((state) => state.executeAction);
  const executeActionDebounced = useMapStore((state) => state.executeActionDebounced);
  const activateMeasurement = useMapStore((state) => state.baseLayerActivateMeasurement);
  const deactivateMeasurement = useMapStore((state) => state.baseLayerDeactivateMeasurement);

  const { t } = useTranslation(['common', 'baseLayerForm']);

  // React either requires a defaultValue or value plus onChange props on an input field.
  //
  // Therefore, this seems to be the only way to keep track of external state changes to the file path while
  // using the onFocusEvent handler to update the state from this component.
  const [pathInput, setPathInput] = useState(trackedState.nextcloudImagePath);
  useEffect(() => {
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

    const scale = calculateScale(measuredDistance, trackedState.scale, actualDistance);
    const path = trackedState.nextcloudImagePath;
    const rotation = trackedState.rotation;
    executeActionDebounced(new UpdateBaseLayerAction(rotation, scale, path), 'baseLayer_changeScale', 300);

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
        onFocus={(e) => {
            const scale = trackedState.scale;
            const path = e.target.value;
            const rotation = trackedState.rotation;
            executeAction(new UpdateBaseLayerAction(rotation, scale, path));
          }
        }
        onChange={(e) => setPathInput(e.target.value)}
        value={pathInput}
      />
      <SimpleFormInput
        id="rotation"
        labelText={t('baseLayerForm:rotation_field')}
        onChange={(e) => {
          const scale = trackedState.scale;
          const path = trackedState.nextcloudImagePath;
          const rotation = parseInt(e.target.value);
          executeActionDebounced(new UpdateBaseLayerAction(rotation, scale, path), 'baseLayer_changeRotation', 300);
        }}
        type="number"
        value={trackedState.rotation}
        min="0"
        max="359"
      />
      <div className="flex flex-row items-end gap-2">
        <SimpleFormInput
          id="scale"
          labelText={t('baseLayerForm:scale')}
          onChange={(e) => {
            const scale = parseInt(e.target.value);
            const path = trackedState.nextcloudImagePath;
            const rotation = trackedState.rotation;
            executeActionDebounced(new UpdateBaseLayerAction(rotation, scale, path), 'baseLayer_changeScale', 300);
          }}
          type="number"
          value={trackedState.scale}
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
    </div>
  );
};

export default BaseLayerRightToolbar;
