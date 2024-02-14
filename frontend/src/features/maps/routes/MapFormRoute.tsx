import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapCollaboratorDto, PrivacyOption, UserDto } from '@/api_types/definitions';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import {
  useAddCollaborator,
  useFindCollaborators,
  useRemoveCollaborator,
} from '../hooks/collaboratorHookApi';
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
  const { data: collaborators } = useFindCollaborators(mapId);
  const { mutate: addCollaborator } = useAddCollaborator();
  const { mutate: removeCollaborator } = useRemoveCollaborator();

  const { mutate: editMap } = useEditMap();

  if (!data || !collaborators) {
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

  function onAddCollaborator(collaborator: UserDto) {
    addCollaborator({
      mapId,
      dto: {
        userId: collaborator.id,
      },
    });
  }

  function onRemoveCollaborator(userId: string) {
    removeCollaborator({
      mapId,
      dto: {
        userId,
      },
    });
  }

  return (
    <>
      <PageTitle title={t('maps:edit.title')} />
      <MapForm
        onAddCollaborator={onAddCollaborator}
        onRemoveCollaborator={onRemoveCollaborator}
        defaultValues={defaultValues}
        collaborators={collaborators}
        onSubmit={onSubmit}
        isEdit
      />
    </>
  );
}

function MapCreateForm() {
  const { t } = useTranslation(['maps']);
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState<MapCollaboratorDto[]>([]);

  const { mutate: createMap } = useCreateMap();
  const { mutate: addCollaborator } = useAddCollaborator();

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
        onSuccess: (data) => {
          // TODO: make this better
          const promises = collaborators.map((col) =>
            addCollaborator({
              mapId: data.id,
              dto: col,
            }),
          );
          Promise.all(promises).then(() => navigate('/maps'));
        },
      },
    );
  }

  function onAddCollaborator(collaborator: UserDto) {
    setCollaborators((prev) => {
      return prev.findIndex((c) => c.userId === collaborator.id) === -1
        ? [
            ...prev,
            {
              userId: collaborator.id,
              username: collaborator.username,
              // just a placeholder, the mapId is not known yet
              mapId: -1,
            },
          ]
        : prev;
    });
  }

  function onRemoveCollaborator(userId: string) {
    setCollaborators((prev) => prev.filter((c) => c.userId !== userId));
  }

  return (
    <>
      <PageTitle title={t('maps:create.title')} />
      <MapForm
        onRemoveCollaborator={onRemoveCollaborator}
        onAddCollaborator={onAddCollaborator}
        defaultValues={defaultValues}
        collaborators={collaborators}
        onSubmit={onSubmit}
        isEdit={false}
      />
    </>
  );
}
