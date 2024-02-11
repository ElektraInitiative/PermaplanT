import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { PrivacyOption } from '@/api_types/definitions';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import { useCreateMap, useEditMap, useFindMapById } from '../hooks/mapHookApi';
import { MapForm, MapFormData } from './MapForm';

export function MapFormRoute() {
  const mapId = useParams().id;

  return (
    <PageLayout>{mapId ? <MapEditForm mapId={parseInt(mapId)} /> : <MapCreateForm />}</PageLayout>
  );
}

function MapEditForm({ mapId }: { mapId: number }) {
  const navigate = useNavigate();
  const { t } = useTranslation(['maps']);

  const { data } = useFindMapById(mapId);
  const { mutate: editMap } = useEditMap();

  if (!data) {
    return null;
  }

  const defaultValues: MapFormData = {
    name: data.name,
    privacy: data.privacy,
    description: data.description ?? '',
    latitude: data.location?.latitude ?? null,
    longitude: data.location?.longitude ?? null,
  };

  function onSubmit(data: MapFormData) {
    editMap(
      {
        id: mapId,
        map: {
          name: data.name,
          privacy: data.privacy,
          description: data.description,
          location:
            data.latitude && data.longitude
              ? {
                  latitude: data.latitude,
                  longitude: data.longitude,
                }
              : undefined,
        },
      },
      {
        onSuccess: () => {
          navigate('/maps');
        },
      },
    );
  }

  return (
    <>
      <PageTitle title={t('maps:edit.title')} />
      <MapForm defaultValues={defaultValues} onSubmit={onSubmit} isEdit />
    </>
  );
}

function MapCreateForm() {
  const { t } = useTranslation(['maps']);
  const navigate = useNavigate();

  const { mutate: createMap } = useCreateMap();

  const defaultValues: MapFormData = {
    name: '',
    privacy: PrivacyOption.Public,
    description: '',
    latitude: null,
    longitude: null,
  };

  function onSubmit(data: MapFormData) {
    createMap(
      {
        name: data.name,
        privacy: data.privacy,
        description: data.description,
        location:
          data.latitude && data.longitude
            ? {
                latitude: data.latitude,
                longitude: data.longitude,
              }
            : undefined,
        creation_date: new Date().toISOString().split('T')[0],
        is_inactive: false,
        zoom_factor: 100,
        honors: 0,
        visits: 0,
        harvested: 0,
        geometry: {
          rings: [
            [
              { x: -5_000.0, y: -5_000.0 },
              { x: -5_000.0, y: 5_000.0 },
              { x: 5_000.0, y: 5_000.0 },
              { x: 5_000.0, y: -5_000.0 },
              { x: -5_000.0, y: -5_000.0 },
            ],
          ],
          srid: 4326,
        },
      },
      {
        onSuccess: () => {
          navigate('/maps');
        },
      },
    );
  }

  return (
    <>
      <PageTitle title={t('maps:create.modal_title')} />
      <MapForm defaultValues={defaultValues} onSubmit={onSubmit} isEdit={false} />
    </>
  );
}
