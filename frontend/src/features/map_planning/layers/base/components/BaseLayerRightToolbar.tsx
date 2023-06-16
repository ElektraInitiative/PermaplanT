import { UpdateBaseLayerAction } from '../../../layers/base/actions';
import { Action, TrackedBaseLayerState } from '../../../store/MapStoreTypes';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BaseLayerFormProps {
  state: TrackedBaseLayerState;
  executeAction: (action: Action<unknown, unknown>) => void;
}

const BaseLayerRightToolbar = ({ state, executeAction }: BaseLayerFormProps) => {
  const { t } = useTranslation(['common', 'baseLayerForm']);

  const [rotationInput, setRotationInput] = useState(state.rotation);
  const [pathInput, setPathInput] = useState(state.nextcloudImagePath);

  useEffect(() => {
    setRotationInput(state.rotation);
    setPathInput(state.nextcloudImagePath);
  }, [state.nextcloudImagePath, state.rotation]);

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
          executeAction(new UpdateBaseLayerAction(rotationInput, state.scale, pathInput))
        }
      >
        {t('common:apply')}
      </SimpleButton>
    </div>
  );
};

export default BaseLayerRightToolbar;
