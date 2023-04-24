import { NewSeedDto, Quality, Quantity, SeedDto } from '../../../bindings/definitions';
import PaginatedSelectMenu, {
  Page,
  PageAdditionalInfo,
} from '../../../components/Form/PaginatedSelectMenu';
import SelectMenu, { SelectOption } from '../../../components/Form/SelectMenu';
import { searchPlants } from '../api/searchPlants';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { enumToSelectOptionArr } from '@/utils/enum';
import { useTranslatedQuality, useTranslatedQuantity } from '@/utils/translated-enums';
import { Suspense, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface CreateSeedFormProps {
  isUploadingSeed: boolean;
  existingSeed?: SeedDto;
  submitButtonTitle: string;
  onCancel: () => void;
  onChange: () => void;
  onSubmit: (newSeed: NewSeedDto) => void;
}

const CreateSeedForm = ({
  isUploadingSeed,
  existingSeed,
  submitButtonTitle,
  onCancel,
  onChange,
  onSubmit,
}: CreateSeedFormProps) => {
  const { t } = useTranslation(['common', 'seeds']);

  const translatedQuality = useTranslatedQuality();
  const translatedQuantity = useTranslatedQuantity();

  const quality: SelectOption[] = enumToSelectOptionArr(Quality, translatedQuality);
  const quantity: SelectOption[] = enumToSelectOptionArr(Quantity, translatedQuantity);

  const currentYear = new Date().getFullYear();

  const { register, handleSubmit, control, setValue } = useForm<NewSeedDto>();

  useEffect(() => {
    if (existingSeed) {
      setValue('harvest_year', existingSeed?.harvest_year);
      setValue('name', existingSeed?.name);
      setValue('generation', existingSeed?.generation);
      setValue('origin', existingSeed?.origin);
      setValue('taste', existingSeed?.taste);
      setValue('yield_', existingSeed?.yield_);
      setValue('use_by', existingSeed?.use_by);
      setValue('price', existingSeed?.price);
      setValue('quality', existingSeed?.quality);
      setValue('notes', existingSeed?.notes);
      setValue('plant_id', 1);
    }
  }, [existingSeed, setValue]);

  const onFormSubmit: SubmitHandler<NewSeedDto> = async (data) => {
    if (data.origin === '') delete data.origin;
    if (data.taste === '') delete data.taste;
    if (data.yield_ === '') delete data.yield_;
    if (data.use_by === '') delete data.use_by;
    if (Number.isNaN(data.generation)) delete data.generation;
    if (Number.isNaN(data.price)) delete data.price;
    if (data.use_by) {
      // Change the date to YYYY-MM-DD format so it can be parsed by the backend
      data.use_by = new Date(String(data.use_by)).toISOString().split('T')[0];
    }

    onSubmit(data);
  };

  const loadPlants = async (
    search: string,
    options: unknown,
    additional: PageAdditionalInfo | undefined,
  ): Promise<Page> => {
    const pageNumber = additional != undefined ? additional.pageNumber : 1;
    const page = await searchPlants(search, pageNumber);

    const plant_options: SelectOption[] = page.results.map((plant) => {
      const common_name = plant.common_name != null ? ' (' + plant.common_name[0] + ')' : '';

      return {
        value: plant.id,
        label: plant.binomial_name + common_name,
      };
    });

    return {
      options: plant_options,
      hasMore: page.total_pages > pageNumber,
      additional: {
        pageNumber: pageNumber + 1,
      },
    };
  };

  return (
    <Suspense>
      <div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="mb-6 grid gap-8 md:grid-cols-2">
            <PaginatedSelectMenu
              id="plant_id"
              control={control}
              labelText={t('seeds:binomial_name')}
              placeholder={t('seeds:create_seed_form.placeholder_binomial_name')}
              required={true}
              loadOptions={loadPlants}
              handleOptionsChange={(option) => {
                if (!option) {
                  setValue('plant_id', undefined);
                } else {
                  const temp = option as SelectOption;
                  const mapped = temp.value as number;
                  setValue('plant_id', mapped);
                }
              }}
              onChange={onChange}
            />
            <SimpleFormInput
              labelText={t('seeds:additional_name')}
              placeHolder=""
              required={true}
              id="name"
              register={register}
              onChange={onChange}
            />
            <SimpleFormInput
              type="number"
              labelText={t('seeds:harvest_year')}
              defaultValue={currentYear}
              placeHolder={currentYear.toString()}
              required={true}
              id="harvest_year"
              register={register}
              onChange={onChange}
            />
            <SelectMenu
              id="quantity"
              control={control}
              options={quantity}
              labelText={t('seeds:quantity')}
              required={true}
              handleOptionsChange={(option) => {
                const temp = option as SelectOption;
                const mapped = temp.value as Quantity;
                setValue('quantity', mapped);
              }}
              onChange={onChange}
            />
            <SimpleFormInput
              type="date"
              labelText={t('seeds:use_by')}
              placeHolder=""
              id="use_by"
              register={register}
              onChange={onChange}
            />
            <SimpleFormInput
              labelText={t('seeds:origin')}
              placeHolder={t('seeds:create_seed_form.placeholder_origin')}
              id="origin"
              register={register}
              onChange={onChange}
            />
            <SelectMenu
              id="quality"
              control={control}
              options={quality}
              labelText={t('seeds:quality')}
              handleOptionsChange={(option) => {
                const temp = option as SelectOption;
                const mapped = temp.value as Quality;
                setValue('quality', mapped);
              }}
              onChange={onChange}
            />
            <SimpleFormInput
              labelText={t('seeds:taste')}
              placeHolder={t('seeds:create_seed_form.placeholder_taste')}
              id="taste"
              register={register}
              onChange={onChange}
            />
            <SimpleFormInput
              labelText={t('seeds:yield')}
              placeHolder={t('seeds:create_seed_form.placeholder_yield')}
              id="yield_"
              register={register}
              onChange={onChange}
            />
            <SimpleFormInput
              labelText={t('seeds:price')}
              placeHolder={t('seeds:create_seed_form.placeholder_price')}
              id="price"
              register={register}
              valueAsNumber={true}
              errorTitle={t('seeds:create_seed_form.error_price_must_be_number')}
              onChange={onChange}
            />
            <SimpleFormInput
              type="number"
              min={0}
              labelText={t('seeds:generation')}
              placeHolder={t('seeds:create_seed_form.placeholder_generation')}
              id="generation"
              register={register}
              onChange={onChange}
            />
          </div>
          <div className="mb-6">
            <SimpleFormInput
              isArea={true}
              labelText={t('seeds:notes')}
              placeHolder="..."
              id="notes"
              register={register}
              onChange={onChange}
            />
          </div>
          <div className="flex flex-row justify-between space-x-4">
            <SimpleButton
              type="button"
              onClick={onCancel}
              className="max-w-[240px] grow sm:w-auto"
              variant={ButtonVariant.secondaryBase}
            >
              {t('common:cancel')}
            </SimpleButton>
            <SimpleButton
              title={submitButtonTitle}
              type="submit"
              className="max-w-[240px] grow sm:w-auto"
            >
              {submitButtonTitle}
              {isUploadingSeed && (
                <svg
                  className="ml-4 inline-block h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </SimpleButton>
          </div>
        </form>
      </div>
    </Suspense>
  );
};

export default CreateSeedForm;
