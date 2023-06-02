import { createMap } from '../api/createMap';
import { NewMapDto, LatLng } from '@/bindings/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import PageLayout from '@/components/Layout/PageLayout';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, useMapEvent } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

export default function MapCreateForm() {
  const { t } = useTranslation(['maps']);
  const [missingName, setMissingName] = useState(false);
  const navigate = useNavigate();

  const missingNameText = (
    <p className="mb-2 block text-sm font-medium text-red-500">{t('maps:overview.missing_name')}</p>
  );

  const location: LatLng = {
    lat: NaN,
    lng: NaN,
  };

  async function onSubmit() {
    const mapNameInput = document.getElementById('mapNameInput') as HTMLInputElement;
    const mapPrivateCheckbox = document.getElementById('mapPrivateCheckbox') as HTMLInputElement;
    const mapDescriptionTextfield = document.getElementById(
      'mapDescriptionTextfield',
    ) as HTMLTextAreaElement;
    const mapName = mapNameInput ? mapNameInput.value : '';
    const mapIsPrivate = mapPrivateCheckbox ? mapPrivateCheckbox.checked : false;
    const mapDescription = mapDescriptionTextfield ? mapDescriptionTextfield.value : '';
    if (mapName === '') {
      setMissingName(true);
      return;
    }
    const newMap: NewMapDto = {
      name: mapName,
      creation_date: new Date().toISOString().split('T')[0],
      is_inactive: false,
      zoom_factor: 100,
      honors: 0,
      visits: 0,
      harvested: 0,
      owner_id: 1,
      is_private: mapIsPrivate,
      description: mapDescription,
      location: !Number.isNaN(location.lat) ? location : undefined,
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
          onChange={() => setMissingName(false)}
          className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
          style={{ colorScheme: 'dark' }}
          placeholder="Name"
        />
        {missingName && missingNameText}
        <label className="flex w-full items-center justify-center">
          <input
            id="mapPrivateCheckbox"
            type="checkbox"
            className="mr-3 h-4 w-4 rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
          />
          {t('maps:create.private_label')}
        </label>
      </section>
      <textarea
        id="mapDescriptionTextfield"
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
          <MapClickEventListener mapLocation={location} />
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

interface MapClickEventListenerProps {
  mapLocation: LatLng;
}

function MapClickEventListener({ mapLocation }: MapClickEventListenerProps) {
  const { t } = useTranslation(['maps']);

  const map = useMapEvent('click', (e) => {
    map.openPopup(t('maps:create.location_selected'), e.latlng);
    mapLocation.lat = e.latlng.lat;
    mapLocation.lng = e.latlng.lng;
  });
  return null;
}
