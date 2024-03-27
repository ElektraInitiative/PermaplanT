import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { MapCollaboratorDto, PrivacyOption, UserDto } from '@/api_types/definitions';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import SelectMenu, { SelectOption } from '@/components/Form/SelectMenu';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import SimpleFormTextArea from '@/components/Form/SimpleFormTextArea';
import ZodValidatedFormInput from '@/components/Form/ZodValidatedFromInput';
import MapPinIcon from '@/svg/icons/map-pin.svg?react';
import { enumFromStringValue, enumToSelectOptionArr } from '@/utils/enum';
import { useTranslatedPrivacy } from '@/utils/translated-enums';
import { CollaboratorPanel } from '../components/CollaboratorPanel';
import { useSearchUsers } from '../hooks/userHookApi';

const MapFormSchema = z
  .object({
    name: z.string().trim().min(1),
    description: z.string().trim(),
    privacy: z.enum([PrivacyOption.Private, PrivacyOption.Protected, PrivacyOption.Public]),
    latitude: z
      .custom()
      .nullable()
      .transform((val) => {
        if (val === null || val === '') return null;
        return Number(val);
      }),
    longitude: z
      .custom()
      .nullable()
      .transform((val) => {
        if (val === null || val === '') return null;
        return Number(val);
      }),
  })
  .superRefine((schema, ctx) => {
    if (schema.latitude !== null && schema.longitude === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Longitude is required if latitude is set',
        path: ['longitude'],
      });
    }

    if (schema.longitude !== null && schema.latitude === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Latitude is required if longitude is set',
        path: ['latitude'],
      });
    }
  });

export type MapFormData = z.infer<typeof MapFormSchema>;

export interface MapFormProps {
  defaultValues: MapFormData;
  collaborators: MapCollaboratorDto[];
  onSubmit: (data: MapFormData) => void;
  onAddCollaborator: (collaborator: UserDto) => void;
  onRemoveCollaborator: (userId: string) => void;
  isEdit: boolean;
}

export function MapForm({
  defaultValues,
  collaborators,
  isEdit,
  onSubmit,
  onAddCollaborator,
  onRemoveCollaborator,
}: MapFormProps) {
  const navigate = useNavigate();
  const formInfo = useForm<MapFormData>({
    defaultValues,
    resolver: zodResolver(MapFormSchema),
  });
  const { queryInfo, actions: searchUserActions } = useSearchUsers();

  const translatedPrivacy = useTranslatedPrivacy();
  const privacy: SelectOption[] = enumToSelectOptionArr(PrivacyOption, translatedPrivacy).reverse();
  const [privacyOption, setPrivacyOption] = useState<SelectOption>(
    privacy.find((option) => option.value === defaultValues.privacy) || privacy[0],
  );
  const privacyValue = formInfo.watch('privacy');

  function onCancel() {
    navigate('/maps');
  }

  const handleSubmit = formInfo.handleSubmit(onSubmit, console.error);

  const userSearchResults = queryInfo.data?.filter((user) =>
    collaborators.every((c) => c.userId !== user.id),
  );

  return (
    <FormProvider {...formInfo}>
      <div className="flex flex-col gap-4">
        <SimpleFormInput
          className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
          id="name"
          register={formInfo.register}
          aria-invalid={Boolean(formInfo.formState.errors.name)}
          required
          labelContent={t('maps:form.name_label')}
          placeholder={t('maps:form.name_placeholder')}
        />

        {/** PRIVACY */}
        <div className="grid grid-cols-[1fr_2fr]">
          <SelectMenu
            id="privacy"
            control={formInfo.control}
            options={privacy}
            required
            isClearable={false}
            isMulti={false}
            value={privacyOption}
            handleOptionsChange={(option) => {
              if (!option) return;

              setPrivacyOption(option);
              const value = enumFromStringValue(PrivacyOption, `${option.value}`);

              if (!value) {
                console.error('Invalid privacy option ', option);
                return;
              }

              formInfo.setValue('privacy', value);
            }}
            labelText={t('maps:form.privacy_label')}
          />

          <div className="ml-4 mt-6 flex items-center text-neutral-400">
            {t(`privacyOptions:${privacyValue}_info`)}
          </div>
        </div>

        {/** DESCRIPTION */}
        <SimpleFormTextArea
          className="h-auto"
          id="description"
          register={formInfo.register}
          labelText={t('maps:form.description_label')}
          placeholder={t('maps:form.description_placeholder')}
          rows={2}
        />

        <div className="grid grid-cols-[1fr_1fr] gap-4">
          {/** LOCATION LATITUDE, LONGITUDE OR MAP */}
          <LocationInput />

          {/** COLLABORATOR */}
          <div className="flex shrink-0 grow">
            <CollaboratorPanel
              onRemoveCollaborator={onRemoveCollaborator}
              collaborators={collaborators}
              handleSearch={searchUserActions.searchUsers}
              onResultClick={onAddCollaborator}
              userSearchResults={userSearchResults}
            />
          </div>
        </div>

        <div className="flex flex-row justify-between space-x-4">
          <SimpleButton
            className="max-w-[240px] grow sm:w-auto"
            title={t('common:cancel')}
            onClick={onCancel}
            variant={ButtonVariant.secondaryBase}
          >
            {t('common:cancel')}
          </SimpleButton>
          <SimpleButton
            title={t(isEdit ? 'common:save' : 'common:create')}
            onClick={handleSubmit}
            type="submit"
            className="max-w-[240px] grow sm:w-auto"
          >
            {t(isEdit ? 'common:save' : 'common:create')}
          </SimpleButton>
        </div>
      </div>
    </FormProvider>
  );
}

function LocationInput() {
  const formInfo = useFormContext<MapFormData>();
  const [mapVisible, setMapVisible] = useState(false);

  return (
    <div className=" md:min-w-[32rem]">
      {mapVisible ? (
        <LocationMapInput />
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex justify-center">
            <SimpleButton
              className="max-w-80"
              title={t('maps:form.location_button_hint')}
              variant={ButtonVariant.secondaryBase}
              onClick={() => setMapVisible(true)}
            >
              Select your location on the map
              <MapPinIcon className="ml-2 h-7 w-7 stroke-current" />
            </SimpleButton>
          </div>

          <div className="relative">
            <div className="inline-flex w-full items-center justify-center">
              <hr className="my-4 h-0.5 w-64 rounded border-0 bg-neutral-300 dark:bg-neutral-700" />
              <div className="absolute left-1/2 -translate-x-1/2 bg-[rgb(238,238,238)] px-4 dark:bg-[rgb(33,33,33)]">
                {t('maps:form.or')}
              </div>
            </div>
          </div>

          <ZodValidatedFormInput
            id="latitude"
            register={formInfo.register}
            type="number"
            aria-invalid={Boolean(formInfo.formState.errors.latitude)}
            errorTitle={formInfo.formState.errors.latitude?.message ?? undefined}
            labelContent={t('maps:form.latitude_label')}
            placeholder={t('maps:form.latitude_label')}
          />

          <ZodValidatedFormInput
            id="longitude"
            register={formInfo.register}
            type="number"
            aria-invalid={Boolean(formInfo.formState.errors.longitude)}
            errorTitle={formInfo.formState.errors.longitude?.message ?? undefined}
            labelContent={t('maps:form.longitude_label')}
            placeholder={t('maps:form.longitude_label')}
          />
        </div>
      )}
    </div>
  );
}

function LocationMapInput() {
  return (
    <div className="mb-4 mt-2 h-[50vh] min-h-[24rem] w-full max-w-6xl grow rounded bg-neutral-100 p-4 md:min-w-[32rem] md:p-4 dark:border-neutral-300-dark dark:bg-neutral-200-dark">
      <MapContainer center={[47.57, 16.496]} zoom={7} scrollWheelZoom={true}>
        <MapView />
      </MapContainer>
    </div>
  );
}

function MapView() {
  const { t } = useTranslation(['maps']);
  const formInfo = useFormContext<MapFormData>();
  const map = useMapEvents({
    click: (e) => {
      map.openPopup(t('maps:form.location_selected'), e.latlng);
      formInfo.setValue('latitude', e.latlng.lat);
      formInfo.setValue('longitude', e.latlng.lng);
    },
    popupclose: () => {
      formInfo.resetField('latitude');
      formInfo.resetField('longitude');
    },
  });

  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  );
}
