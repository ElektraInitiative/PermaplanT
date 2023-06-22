import { UpdateBaseLayerAction } from '../../../layers/base/actions';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const BaseLayerRightToolbar = () => {
  const trackedState = useMapStore((state) => state.trackedState.layers.Base);
  const untrackedState = useMapStore((state) => state.untrackedState.layers.Base);
  const executeAction = useMapStore((state) => state.executeAction);
  const activateMeasurement = useMapStore((state) => state.baseLayerActivateMeasurement);
  const deactivateMeasurement = useMapStore((state) => state.baseLayerDeactivateMeasurement);

  const { t } = useTranslation(['common', 'baseLayerForm']);

  const [rotationInput, setRotationInput] = useState(trackedState.rotation);
  const [pathInput, setPathInput] = useState(trackedState.nextcloudImagePath);

  useEffect(() => {
    setRotationInput(trackedState.rotation);
    setPathInput(trackedState.nextcloudImagePath);
  }, [trackedState.nextcloudImagePath, trackedState.rotation]);

  return (
    <div className="flex flex-col gap-2 p-2">
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
      <SimpleButton
        onClick={() =>
          executeAction(new UpdateBaseLayerAction(rotationInput, trackedState.scale, pathInput))
        }
      >
        {t('common:apply')}
      </SimpleButton>
    </div>
  );
};

export default BaseLayerRightToolbar;
