import { findMapById } from '../api/findMapById';
import { MapDto, PrivacyOptions, UpdateMapDto } from '@/bindings/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import PageLayout from '@/components/Layout/PageLayout';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';

export default function MapEditForm() {
  const { mapId } = useParams();
  const { t } = useTranslation(['maps']);
  const [map, setMap] = useState<MapDto | null>(null);
  const [updateObject, setUpdateObject] = useState<UpdateMapDto>({});
  const navigate = useNavigate();

  useEffect(() => {
    const _findOneMap = async () => {
      try {
        const map = await findMapById(Number(mapId));
        setMap(map);

        setUpdateObject({
          name: map.name,
          privacy: map.privacy,
          description: map.description,
          location: map.location,
        });
      } catch (error) {
        throw error as Error;
      }
    };
    _findOneMap();
  }, [mapId]);

  const privacyOptions = [
    PrivacyOptions.Private,
    PrivacyOptions.Protected,
    PrivacyOptions.Public,
  ].map((option) => (
    <option key={option} value={option}>
      {t(`maps:create.${option}`)}
    </option>
  ));

  const privacyDetailText = (
    <p className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-center text-sm font-medium dark:border-neutral-400-dark dark:bg-neutral-50-dark">
      {t(`maps:create.${updateObject.privacy}_info`)}
    </p>
  );

  async function onSubmit() {
    navigate('/maps');
  }

  function onCancel() {
    navigate('/maps');
  }
  console.log(map);

  //const mapPosition: LatLngExpression = map?.location
  //  ? [map.location.latitude, map.location.longitude]
  //  : [0, 0];

  return (
    <PageLayout>
      <h2>{t('maps:edit.title')}</h2>
      <input
        id="mapNameInput"
        name="name"
        onChange={(e) => {
          setUpdateObject({ ...updateObject, name: e.target.value });
        }}
        className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
        style={{ colorScheme: 'dark' }}
        placeholder="Name"
        defaultValue={updateObject.name}
      />
      <section className="my-2 flex items-center">
        <select
          className="mr-4 block h-11 rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
          onChange={(e) => {
            const value = e.target.value;
            const option = value.charAt(0).toUpperCase() + value.slice(1);
            setUpdateObject({
              ...updateObject,
              privacy: PrivacyOptions[option as keyof typeof PrivacyOptions],
            });
          }}
          value={updateObject.privacy}
        >
          {privacyOptions}
        </select>
        {privacyDetailText}
      </section>
      <textarea
        id="mapDescriptionTextfield"
        name="description"
        onChange={(e) => setUpdateObject({ ...updateObject, description: e.target.value })}
        className="mb-4 block h-24 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
        style={{ colorScheme: 'dark' }}
        placeholder={t('maps:create.description_placeholer')}
        defaultValue={updateObject.description}
      />
      <div className="mb-4 mt-2 h-[50vh] min-h-[24rem] w-full max-w-6xl grow rounded bg-neutral-100 p-4 dark:border-neutral-300-dark dark:bg-neutral-200-dark md:min-w-[32rem] md:p-4">
        <MapContainer center={[47.57, 16.496]} zoom={7} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventListener mapState={updateObject} setMapState={setUpdateObject} />
        </MapContainer>
      </div>
      <div className="space-between flex flex-row justify-center space-x-8">
        <SimpleButton
          onClick={onCancel}
          className="max-w-[240px] grow"
          title={t('maps:create.cancel_button')}
        >
          {t('maps:create.cancel_button')}
        </SimpleButton>
        <SimpleButton
          onClick={onSubmit}
          className="max-w-[240px] grow"
          title={t('maps:create.submit_button')}
        >
          {t('maps:edit.save')}
        </SimpleButton>
      </div>
    </PageLayout>
  );
}

interface MapEventListenerProps {
  mapState: UpdateMapDto;
  setMapState: (mapState: UpdateMapDto) => void;
}

function MapEventListener({ mapState, setMapState }: MapEventListenerProps) {
  const { t } = useTranslation(['maps']);

  const map = useMapEvents({
    click: (e) => {
      map.openPopup(t('maps:create.location_selected'), e.latlng);
      setMapState({
        ...mapState,
        location: {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        },
      });
    },
    popupclose: () => {
      setMapState({
        ...mapState,
        location: {
          latitude: NaN,
          longitude: NaN,
        },
      });
    },
  });
  return null;
}
