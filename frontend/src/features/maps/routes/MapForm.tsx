import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { PrivacyOption } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import SelectMenu, { SelectOption } from '@/components/Form/SelectMenu';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import SimpleFormTextArea from '@/components/Form/SimpleFormTextArea';
import ZodValidatedFormInput from '@/components/Form/ZodValidatedFromInput';
import MapPinIcon from '@/svg/icons/map-pin.svg?react';
import { enumFromStringValue, enumToSelectOptionArr } from '@/utils/enum';
import { useTranslatedPrivacy } from '@/utils/translated-enums';

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
  onSubmit: (data: MapFormData) => void;
  isEdit: boolean;
}

export function MapForm({ defaultValues, onSubmit, isEdit }: MapFormProps) {
  const navigate = useNavigate();
  const formInfo = useForm<MapFormData>({
    defaultValues,
    resolver: zodResolver(MapFormSchema),
  });

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

        <SimpleFormTextArea
          className="h-auto"
          id="description"
          register={formInfo.register}
          labelText={t('maps:form.description_label')}
          placeholder={t('maps:form.description_placeholder')}
          rows={2}
        />

        <div className="grid grid-cols-[3fr_1fr]">
          <LocationInput />
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

  return mapVisible ? (
    <>
      <SimpleButton onClick={() => setMapVisible(false)} title={'Close map'} className="mb-4" />
      <LocationMapInput />
    </>
  ) : (
    <div className="flex gap-4">
      <IconButton
        className="mt-7"
        title={t('maps:form.location_button_hint')}
        onClick={() => setMapVisible(true)}
      >
        <MapPinIcon />
      </IconButton>

      <span className="mt-4 flex items-center justify-center">{t('maps:form.or')}</span>

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
