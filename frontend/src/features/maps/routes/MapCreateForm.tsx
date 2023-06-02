import { createMap } from '../api/createMap';
import { NewMapDto } from '@/bindings/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import PageLayout from '@/components/Layout/PageLayout';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

interface MapCreationAttributes {
  name: string;
  is_private: boolean;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
}

export default function MapCreateForm() {
  const initialData: MapCreationAttributes = {
    name: '',
    is_private: false,
    description: '',
    location: {
      lat: NaN,
      lng: NaN,
    },
  };

  const { t } = useTranslation(['maps']);
  const [missingName, setMissingName] = useState(false);
  const [mapInput, setMapInput] = useState(initialData);
  const navigate = useNavigate();

  const missingNameText = (
    <p className="mb-2 block text-sm font-medium text-red-500">{t('maps:overview.missing_name')}</p>
  );

  async function onSubmit() {
    if (mapInput.name === '') {
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
      is_private: mapInput.is_private,
      description: mapInput.description,
      location: !Number.isNaN(mapInput.location.lat) ? mapInput.location : undefined,
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
      <section className="my-2 flex items-center">
        <input
          id="mapNameInput"
          name="name"
          onChange={(e) => setMapInput({ ...mapInput, name: e.target.value })}
          className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
          style={{ colorScheme: 'dark' }}
          placeholder="Name"
        />
        {missingName && missingNameText}
        <label className="flex w-full items-center justify-center">
          <input
            id="mapPrivateCheckbox"
            name="is_private"
            onChange={(e) => setMapInput({ ...mapInput, is_private: e.target.checked })}
            type="checkbox"
            className="mr-3 h-4 w-4 rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
          />
          {t('maps:create.private_label')}
        </label>
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
        is_private: mapState.is_private,
        description: mapState.description,
        location: {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        },
      });
    },
    popupclose: () => {
      setMapState({
        name: mapState.name,
        is_private: mapState.is_private,
        description: mapState.description,
        location: {
          lat: NaN,
          lng: NaN,
        },
      });
    },
  });
  return null;
}
