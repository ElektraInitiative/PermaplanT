import { findMapById } from '../api/findMapById';
import { updateMap } from '../api/updateMap';
import { Coordinates, MapDto, PrivacyOption, UpdateMapDto } from '@/api_types/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import { errorToastGrouped } from '@/features/toasts/groupedToast';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';

interface MapUpdateData {
  name: string;
  privacy: PrivacyOption;
  description?: string;
  location?: Coordinates;
}

export default function MapEditForm() {
  const initialValue: MapUpdateData = {
    name: '',
    privacy: PrivacyOption.Public,
    description: '',
    location: {
      latitude: NaN,
      longitude: NaN,
    },
  };

  const [updateObject, setUpdateObject] = useState<MapUpdateData>(initialValue);
  const [loadMap, setLoadMap] = useState(false);
  const [missingName, setMissingName] = useState(false);
  const oldValues = useRef<MapDto>();
  const { mapId } = useParams();
  const { t } = useTranslation(['maps', 'privacyOptions', 'common']);
  const navigate = useNavigate();

  useEffect(() => {
    const _findOneMap = async () => {
      try {
        const map = await findMapById(Number(mapId));
        oldValues.current = map;

        setUpdateObject({
          name: map.name,
          privacy: map.privacy,
          description: map.description,
          location: map.location,
        });
      } catch (error) {
        console.error(error);
        errorToastGrouped(t('maps:edit.error_map_single_fetch'), {
          autoClose: false,
          toastId: 'fetchError',
        });
      }
    };
    _findOneMap();
  }, [mapId, t]);

  const missingNameText = (
    <p className="mb-2 ml-2 block text-sm font-medium text-red-500">
      {t('maps:overview.missing_name')}
    </p>
  );

  const options = Object.values(PrivacyOption);

  const privacyDetailText = (
    <p className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-center text-sm font-medium dark:border-neutral-400-dark dark:bg-neutral-50-dark">
      {t(`privacyOptions:${updateObject.privacy}_info`)}
    </p>
  );

  const locationPicker = (
    <>
      <span className="mb-2 block text-lg font-semibold">{t('maps:edit.location_label')}</span>
      <div className="mb-4 mt-2 h-[50vh] min-h-[24rem] w-full max-w-6xl grow rounded bg-neutral-100 p-4 dark:border-neutral-300-dark dark:bg-neutral-200-dark md:min-w-[32rem] md:p-4">
        <MapContainer center={[47.57, 16.496]} zoom={7} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventListener mapState={updateObject} setMapState={setUpdateObject} />
        </MapContainer>
      </div>
    </>
  );

  const locationPickerPlaceholder = (
    <section className="mb-12 flex flex-col items-center">
      <div className="mb-4 flex">
        <div className="mr-2">
          <SimpleFormInput
            id="latitudeInput"
            labelContent={t('maps:edit.latitude_label')}
            defaultValue={updateObject.location?.latitude}
            onChange={(e) =>
              setUpdateObject({
                ...updateObject,
                location: {
                  latitude: +e.target.value.replace(',', '.'),
                  longitude: updateObject.location?.longitude
                    ? updateObject.location.longitude
                    : NaN,
                },
              })
            }
          />
        </div>
        <SimpleFormInput
          id="longitudeInput"
          labelContent={t('maps:edit.longitude_label')}
          defaultValue={updateObject.location?.longitude}
          onChange={(e) =>
            setUpdateObject({
              ...updateObject,
              location: {
                latitude: updateObject.location?.latitude ? updateObject.location.latitude : NaN,
                longitude: +e.target.value.replace(',', '.'),
              },
            })
          }
        />
      </div>
      <SimpleButton
        title={t('maps:edit.location_button_hint')}
        className="mt-4 max-w-[240px]"
        onClick={() => {
          setUpdateObject({ ...updateObject, location: undefined });
          setLoadMap(true);
        }}
      >
        {t('maps:edit.location_button')}
      </SimpleButton>
    </section>
  );

  async function onSubmit() {
    if (updateObject.name.trim() === '') {
      setMissingName(true);
      return;
    }
    const updatedMap: UpdateMapDto = {
      name: updateObject.name,
      privacy: updateObject.privacy,
      description: updateObject.description,
      location: updateObject.location,
    };
    if (updateObject.location && isNaN(updateObject.location?.latitude)) {
      updatedMap.location = undefined;
    }
    if (updateObject.location === oldValues.current?.location) {
      updatedMap.location = undefined;
    }
    if (updateObject.description === oldValues.current?.description) {
      updatedMap.description = undefined;
    }
    if (updateObject.privacy === oldValues.current?.privacy) {
      console.log(`Old: ${oldValues.current.privacy}\nNew: ${updateObject.privacy}`);
      updatedMap.privacy = undefined;
    }
    if (updateObject.name === oldValues.current?.name) {
      updatedMap.name = undefined;
    }
    try {
      await updateMap(updatedMap, Number(mapId));
    } catch (error) {
      errorToastGrouped(t('maps:edit.error_map_edit'), { autoClose: false });
    }
    navigate('/maps');
  }

  return (
    <Suspense>
      <PageLayout>
        {oldValues.current && (
          <div>
            <PageTitle title={t('maps:edit.title')} />
            <SimpleFormInput
              id="nameInput"
              labelContent="Name"
              required
              defaultValue={updateObject.name}
              onChange={(e) => {
                setMissingName(false);
                setUpdateObject({ ...updateObject, name: e.target.value });
              }}
            />
            {missingName && missingNameText}
            <label htmlFor="privacySelect" className="mb-2 mt-4 block text-sm font-medium">
              {t('maps:edit.privacy_label')}
            </label>
            <section className="my-2 flex items-center">
              <select
                id="privacySelect"
                className="mr-4 block h-11 rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
                defaultValue={updateObject.privacy as PrivacyOption}
                onChange={(e) =>
                  setUpdateObject({ ...updateObject, privacy: e.target.value as PrivacyOption })
                }
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {t(`privacyOptions:${option}`)}
                  </option>
                ))}
              </select>
              {privacyDetailText}
            </section>
            <label htmlFor="descriptionArea" className="mb-2 mt-4 block text-sm font-medium">
              {t('maps:edit.description_label')}
            </label>
            <textarea
              id="descriptionArea"
              className="mb-4 block h-24 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
              defaultValue={updateObject.description}
              onChange={(e) => setUpdateObject({ ...updateObject, description: e.target.value })}
            />
            {loadMap && locationPicker}
            {!loadMap && locationPickerPlaceholder}
            <div className="space-between mt-8 flex flex-row justify-center space-x-8">
              <SimpleButton title={t('common:cancel')} onClick={() => navigate(-1)}>
                {t('common:cancel')}
              </SimpleButton>
              <SimpleButton title={t('common:save')} onClick={onSubmit}>
                {t('common:save')}
              </SimpleButton>
            </div>
          </div>
        )}
      </PageLayout>
    </Suspense>
  );
}

interface MapEventListenerProps {
  mapState: MapUpdateData;
  setMapState: (mapState: MapUpdateData) => void;
}

function MapEventListener({ mapState, setMapState }: MapEventListenerProps) {
  const { t } = useTranslation(['maps']);

  const map = useMapEvents({
    click: (e) => {
      map.openPopup(t('maps:edit.location_selected'), e.latlng);
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
        location: undefined,
      });
    },
  });
  return null;
}
