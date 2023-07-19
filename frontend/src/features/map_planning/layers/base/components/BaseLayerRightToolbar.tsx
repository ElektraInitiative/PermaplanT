import { UpdateBaseLayerAction } from '../../../layers/base/actions';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import useMapStore from '@/features/map_planning/store/MapStore';
import FileSelectorModal from '@/features/nextcloud_integration/components/FileSelectorModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileStat } from 'webdav';

export const BaseLayerRightToolbar = () => {
  const baseLayerState = useMapStore((state) => state.trackedState.layers.base);
  // const { measureStep } = useMapStore((state) => state.untrackedState.layers.base);
  const executeAction = useMapStore((state) => state.executeAction);
  // const activateMeasurement = useMapStore((state) => state.baseLayerActivateMeasurement);
  // const deactivateMeasurement = useMapStore((state) => state.baseLayerDeactivateMeasurement);

  const { t } = useTranslation(['common', 'baseLayerForm']);

  // React either requires a defaultValue or value plus onChange props on an input field.
  //
  // Therefore, this seems to be the only way to keep track of external state changes to the file path while
  // using the onFocusEvent handler to update the state from this component.
  const [pathInput, setPathInput] = useState(baseLayerState.nextcloudImagePath);
  const [rotationInput, setRotationInput] = useState(baseLayerState.rotation);
  const [scaleInput, setScaleInput] = useState(baseLayerState.rotation);
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

  /*
  const [distMeters, setDistMeters] = useState(0);
  const [distCentimeters, setDistCentimeters] = useState(0);
  */

  /*
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
  */

  return (
    <div className="flex flex-col gap-2 p-2">
      {/* Automatic scaling is disabled for now due to a bug related to mouse-drag selection. */}
      {/*
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
      */}
      <h2>{t('baseLayerForm:title')}</h2>
      <SimpleFormInput
        id="file"
        labelText={t('baseLayerForm:image_path_field')}
        onBlur={(e) => {
          const scale = baseLayerState.scale;
          const path = e.target.value;
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
        }}
        onChange={(e) => setPathInput(e.target.value)}
        value={pathInput}
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

      <SimpleButton onClick={() => setShowFileSelector(true)}>
        {t('baseLayerForm:selectImage')}
      </SimpleButton>
      <SimpleFormInput
        id="rotation"
        labelText={t('baseLayerForm:rotation_field')}
        onBlur={(e) => {
          const scale = baseLayerState.scale;
          const path = baseLayerState.nextcloudImagePath;
          const rotation = parseInt(e.target.value);
          executeAction(
            new UpdateBaseLayerAction({
              id: baseLayerState.imageId,
              layer_id: baseLayerState.layerId,
              path: path,
              rotation: rotation,
              scale: scale,
            }),
          );
        }}
        onChange={(e) => setRotationInput(parseInt(e.target.value))}
        type="number"
        value={rotationInput}
        min="0"
        max="359"
      />
      {/* <div className="flex flex-row items-end gap-2"> */}
      <SimpleFormInput
        id="scale"
        labelText={t('baseLayerForm:scale')}
        onBlur={(e) => {
          const scale = parseInt(e.target.value);
          const path = baseLayerState.nextcloudImagePath;
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
        }}
        onChange={(e) => setScaleInput(parseInt(e.target.value))}
        type="number"
        value={scaleInput}
        min="0"
      />
      {/*
        {measureStep === 'inactive' ? (
          <SimpleButton onClick={() => activateMeasurement()}>
            {t('baseLayerForm:set_scale')}
          </SimpleButton>
        ) : (
          <SimpleButton onClick={() => deactivateMeasurement()}>{t('common:cancel')}</SimpleButton>
        )}
      */}
      {/* </div> */}
    </div>
  );
};

export default BaseLayerRightToolbar;
