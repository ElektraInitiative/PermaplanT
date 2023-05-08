import BaseLayerConfigurator from '../components/BaseLayerConfigurator';
import { NewBaseLayerDto } from '@/bindings/definitions';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import { createBaseLayer } from '@/features/map_planning/api/CreateBaseLayer';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'i18next';

export const CreateMap = () => {
  const navigate = useNavigate();
  const {t} = useTranslation('createMap'); 

  const onSubmit = async (baseLayer: NewBaseLayerDto) => {
    await createBaseLayer(baseLayer);

    // redirect to the map page
    // TODO: redirect to the newly created map
    navigate('/map');
  };

  return (
    <PageLayout>
      <PageTitle title={t('createMap:header')} />
      <BaseLayerConfigurator onSubmit={onSubmit}></BaseLayerConfigurator>
    </PageLayout>
  );
};
