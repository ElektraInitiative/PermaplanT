import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { NewMapDto, PrivacyOption } from '@/api_types/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import PageLayout from '@/components/Layout/PageLayout';
import { useCreateMap } from '../hooks/mapHookApi';
import 'leaflet/dist/leaflet.css';

interface MapCreationAttributes {
  name: string;
  privacy: PrivacyOption;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export default function MapCreateForm() {
  const initialData: MapCreationAttributes = {
    name: '',
    privacy: PrivacyOption.Public,
    description: '',
    location: {
      latitude: NaN,
      longitude: NaN,
    },
  };

  const { t } = useTranslation(['maps', 'privacyOptions']);
  const [missingName, setMissingName] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [mapInput, setMapInput] = useState(initialData);
  const navigate = useNavigate();

  const { mutate: createMap } = useCreateMap();

  const missingNameText = (
    <p className="mb-2 ml-2 block text-sm font-medium text-red-500">
      {t('maps:overview.missing_name')}
    </p>
  );

  const privacyOptions = [PrivacyOption.Private, PrivacyOption.Protected, PrivacyOption.Public].map(
    (option) => (
      <option key={option} value={option} data-testid={option}>
        {t(`privacyOptions:${option}`)}
      </option>
    ),
  );

  const privacyDetailText = (
    <p className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-center text-sm font-medium dark:border-neutral-400-dark dark:bg-neutral-50-dark">
      {t(`privacyOptions:${mapInput.privacy}_info`)}
    </p>
  );

  const locationPicker = (
    <div className="mb-4 mt-2 h-[50vh] min-h-[24rem] w-full max-w-6xl grow rounded bg-neutral-100 p-4 md:min-w-[32rem] md:p-4 dark:border-neutral-300-dark dark:bg-neutral-200-dark">
      <MapContainer center={[47.57, 16.496]} zoom={7} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventListener mapState={mapInput} setMapState={setMapInput} />
      </MapContainer>
    </div>
  );

  const locationPickerPlaceholder = (
    <div className="mb-12 flex flex-col items-center">
      <div className="mb-4 flex">
        <input
          id="mapLatInput"
          name="latitude"
          onChange={(e) =>
            setMapInput({
              ...mapInput,
              location: { ...mapInput.location, latitude: +e.target.value.replace(',', '.') },
            })
          }
          className="mr-2 block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
          style={{ colorScheme: 'dark' }}
          placeholder="Latitude"
        />
        <input
          id="mapLngInput"
          name="longitude"
          onChange={(e) =>
            setMapInput({
              ...mapInput,
              location: { ...mapInput.location, longitude: +e.target.value.replace(',', '.') },
            })
          }
          className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
          style={{ colorScheme: 'dark' }}
          placeholder="Longitude"
        />
      </div>
      <span className="text-lg font-medium">{t('maps:create.or')}</span>
      <SimpleButton
        title={t('maps:create.location_button_hint')}
        onClick={() => setMapVisible(true)}
        className="mt-4 max-w-[240px]"
      >
        {t('maps:create.location_button')}
      </SimpleButton>
    </div>
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
      privacy: mapInput.privacy,
      description: mapInput.description,
      location: !Number.isNaN(mapInput.location.latitude) ? mapInput.location : undefined,
      geometry: {
        rings: [
          [
            { x: -500.0, y: -500.0 },
            { x: -500.0, y: 500.0 },
            { x: 500.0, y: 500.0 },
            { x: 500.0, y: -500.0 },
            { x: -500.0, y: -500.0 },
          ],
        ],
        srid: 4326,
      },
    };

    createMap(newMap, {
      onSuccess: () => {
        navigate('/maps');
      },
    });
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
          data-testid="map-create-form__select-privacy"
          onChange={(e) => {
            const value = e.target.value;
            const option = value.charAt(0).toUpperCase() + value.slice(1);
            setMapInput({
              ...mapInput,
              privacy: PrivacyOption[option as keyof typeof PrivacyOption],
            });
          }}
          defaultValue={PrivacyOption.Public}
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
      {mapVisible && locationPicker}
      {!mapVisible && locationPickerPlaceholder}
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
