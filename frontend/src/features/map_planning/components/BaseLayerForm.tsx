import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface BaseLayerFormProps {
  rotation: number;
  nextcloudImagePath: string;
  onRotationChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onImageURLChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const BaseLayerForm = ({
  rotation,
  nextcloudImagePath,
  onRotationChange,
  onImageURLChange,
}: BaseLayerFormProps) => {
  const { t } = useTranslation('baseLayerForm');
  return (
    <div className="flex flex-col gap-2 p-2">
      <h2>{t('title')}</h2>
      <SimpleFormInput
        id="file"
        labelText={t('image_path_field')}
        onChange={onImageURLChange}
        value={nextcloudImagePath}
      />
      <SimpleFormInput
        id="rotation"
        labelText={t('rotation_field')}
        onChange={onRotationChange}
        type="number"
        value={rotation}
        min="0"
        max="359"
      />
    </div>
  );
};

export default BaseLayerForm;
