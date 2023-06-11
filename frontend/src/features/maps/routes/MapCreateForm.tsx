import { createMap } from '../api/createMap';
import { NewMapDto, PrivacyOptions } from '@/bindings/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import PageLayout from '@/components/Layout/PageLayout';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

interface MapCreationAttributes {
  name: string;
  privacy: PrivacyOptions;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export default function MapCreateForm() {
  const initialData: MapCreationAttributes = {
    name: '',
    privacy: PrivacyOptions.Public,
    description: '',
    location: {
      latitude: NaN,
      longitude: NaN,
    },
  };

  const { t } = useTranslation(['maps']);
  const [missingName, setMissingName] = useState(false);
  const [mapInput, setMapInput] = useState(initialData);
  const navigate = useNavigate();

  const missingNameText = (
    <p className="mb-2 ml-2 block text-sm font-medium text-red-500">
      {t('maps:overview.missing_name')}
    </p>
  );

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
      {t(`maps:create.${mapInput.privacy}_info`)}
    </p>
  );

  async function onSubmit() {
    if (mapInput.name.trim() === '') {
      setMissingName(true);
      return;
    }
    const newMap: NewMapDto = {
      name: mapInput.name,
      creation_date: new Date().toISOString().split('T')[0],
      is_inactive: false,
      zoom_factor: 100,
      honors: 0,
      visits: 0,
      harvested: 0,
      owner_id: 1,
      privacy: mapInput.privacy,
      description: mapInput.description,
      location: !Number.isNaN(mapInput.location.latitude) ? mapInput.location : undefined,
    };
    createMap(newMap);
    navigate('/maps');
  }

  function onCancel() {
    navigate('/maps');
  }

  return (
    <PageLayout>
      <h2>{t('maps:create.modal_title')}</h2>
      <input
        id="mapNameInput"
        name="name"
        onChange={(e) => {
          setMapInput({ ...mapInput, name: e.target.value });
          setMissingName(false);
        }}
        className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
        style={{ colorScheme: 'dark' }}
        placeholder="Name *"
      />
      {missingName && missingNameText}
      <section className="my-2 flex items-center">
        <select
          className="mr-4 block h-11 rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
          onChange={(e) => {
            const value = e.target.value;
            const option = value.charAt(0).toUpperCase() + value.slice(1);
            setMapInput({
              ...mapInput,
              privacy: PrivacyOptions[option as keyof typeof PrivacyOptions],
            });
          }}
          defaultValue={PrivacyOptions.Public}
        >
          {privacyOptions}
        </select>
        {privacyDetailText}
      </section>
      <textarea
        id="mapDescriptionTextfield"
        name="description"
        onChange={(e) => setMapInput({ ...mapInput, description: e.target.value })}
        className="mb-4 block h-24 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
        style={{ colorScheme: 'dark' }}
        placeholder={t('maps:create.description_placeholer')}
      />
      <div className="mb-4 mt-2 h-[50vh] min-h-[24rem] w-full max-w-6xl grow rounded bg-neutral-100 p-4 dark:border-neutral-300-dark dark:bg-neutral-200-dark md:min-w-[32rem] md:p-4">
        <MapContainer center={[47.57, 16.496]} zoom={7} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventListener mapState={mapInput} setMapState={setMapInput} />
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
          {t('maps:create.submit_button')}
        </SimpleButton>
      </div>
    </PageLayout>
  );
}

interface MapEventListenerProps {
  mapState: MapCreationAttributes;
  setMapState: (mapState: MapCreationAttributes) => void;
}

function MapEventListener({ mapState, setMapState }: MapEventListenerProps) {
  const { t } = useTranslation(['maps']);

  const map = useMapEvents({
    click: (e) => {
      map.openPopup(t('maps:create.location_selected'), e.latlng);
      setMapState({
        name: mapState.name,
        privacy: mapState.privacy,
        description: mapState.description,
        location: {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        },
      });
    },
    popupclose: () => {
      setMapState({
        name: mapState.name,
        privacy: mapState.privacy,
        description: mapState.description,
        location: {
          latitude: NaN,
          longitude: NaN,
        },
      });
    },
  });
  return null;
}
