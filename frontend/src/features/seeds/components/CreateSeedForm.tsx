import { NewSeedDto, Quality, Quantity } from '../../../bindings/definitions';
import PaginatedSelectMenu, { PageAdditionalInfo, Page } from '../../../components/Form/PaginatedSelectMenu';
import SelectMenu, { SelectOption } from '../../../components/Form/SelectMenu';
import useCreateSeedStore from '../store/CreateSeedStore';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { enumToSelectOptionArr } from '@/utils/enum';
import { SubmitHandler, useForm } from 'react-hook-form';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import { searchPlants } from '../api/searchPlants';

interface CreateSeedFormProps {
  onCancel: () => void;
  onChange: () => void;
  onSubmit: (newSeed: NewSeedDto) => void;
}

const CreateSeedForm = ({
  onCancel,
  onChange,
  onSubmit,
}: CreateSeedFormProps) => {
  const quality: SelectOption[] = enumToSelectOptionArr(Quality);
  const quantity: SelectOption[] = enumToSelectOptionArr(Quantity);

  const currentYear = new Date().getFullYear();

  const { register, handleSubmit, control, setValue } = useForm<NewSeedDto>();
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

  const loadPlants = async (search: string, options: unknown, additional: PageAdditionalInfo | undefined): Promise<Page> => {
    const page = additional != undefined ? additional.page : 1;
    
    console.log(page);
    
    const searchResult = await searchPlants(search, page + 1);
    const plant_options: SelectOption[] = searchResult.dtos.map((plant) => {
        const common_name = plant.common_name != null ? " (" + plant.common_name[0] + ")" : "";    
        
        return {
          value: plant.id,
          label: plant.binomial_name + common_name,
        };
    });

    return {
      options: plant_options,
      hasMore: searchResult.hasMore,
      additional: {
        page: page + 1,
      }
    };
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-6 grid gap-8 md:grid-cols-2">
          <PaginatedSelectMenu
            id="plant_id"
            control={control}
            labelText="Plant Name"
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
            labelText="Additional name"
            placeHolder=""
            required={true}
            id="name"
            register={register}
            onChange={onChange}
          />
          <SimpleFormInput
            type="number"
            labelText="Harvest Year"
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
            labelText="Quantity"
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
            labelText="Best before"
            placeHolder=""
            id="use_by"
            register={register}
            onChange={onChange}
          />
          <SimpleFormInput
            labelText="Origin"
            placeHolder="My Home"
            id="origin"
            register={register}
            onChange={onChange}
          />
          <SelectMenu
            id="quality"
            control={control}
            options={quality}
            labelText="Quality"
            handleOptionsChange={(option) => {
              const temp = option as SelectOption;
              const mapped = temp.value as Quality;
              setValue('quality', mapped);
            }}
            onChange={onChange}
          />
          <SimpleFormInput
            labelText="Taste"
            placeHolder="sweet"
            id="taste"
            register={register}
            onChange={onChange}
          />
          <SimpleFormInput
            labelText="Yield"
            placeHolder="1"
            id="yield_"
            register={register}
            onChange={onChange}
          />
          <SimpleFormInput
            labelText="Price"
            placeHolder="2,99€"
            id="price"
            register={register}
            valueAsNumber={true}
            errorTitle="Price must be a number"
            onChange={onChange}
          />
          <SimpleFormInput
            type="number"
            min={0}
            labelText="Generation"
            placeHolder="0"
            id="generation"
            register={register}
            onChange={onChange}
          />
        </div>
        <div className="mb-6">
          <SimpleFormInput
            isArea={true}
            labelText="Notes"
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
            Cancel
          </SimpleButton>
          <SimpleButton title="Create Seed" type="submit" className="max-w-[240px] grow sm:w-auto">
            Create Seed
            {useCreateSeedStore((state) => state.isUploadingSeed) && (
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
  );
};

export default CreateSeedForm;
