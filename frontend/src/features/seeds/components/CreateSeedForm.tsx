import { NewSeedDTO, Quality, Quantity, Tag } from '../../../bindings/rust_ts_definitions';
import SelectMenu, { SelectOption } from '../../../components/Select/SelectMenu';
import { SubmitHandler, useForm } from 'react-hook-form';

import SimpleFormInput from '@/components/Input/SimpleFormInput';

interface CreateSeedFormProps {
  onCancel: () => void;
  onSubmit: (newSeedDTO: NewSeedDTO) => void;
}

const CreateSeedForm = ({ onCancel, onSubmit }: CreateSeedFormProps) => {
  const { register, handleSubmit, control } = useForm<NewSeedDTO>();
  const onFormSubmit: SubmitHandler<NewSeedDTO> = (data) => console.log(data);

  const tags: SelectOption[] = Object.values(Tag).map((element) => {
    return { value: element, label: element };
  });

  // TODO: get varieties from db
  const varieties: SelectOption[] = Object.values(Tag).map((element) => {
    return { value: element, label: element };
  });

  const quality: SelectOption[] = Object.values(Quality).map((element) => {
    return { value: element, label: element };
  });

  const quantity: SelectOption[] = Object.values(Quantity).map((element) => {
    return { value: element, label: element };
  });

  return (
    <div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-6 grid gap-8 md:grid-cols-2">
          <SimpleFormInput
            labelText="Bezugsjahr"
            placeHolder="2023"
            required={true}
            id="harvest_year"
            register={register}
          />
          <SelectMenu
            id="tags"
            control={control}
            isMulti={true}
            options={tags}
            labelText="Kategorie"
            required={true}
          />
          <SimpleFormInput
            labelText="Art"
            placeHolder="Feldsalat"
            required={true}
            id="name"
            register={register}
          />
          <SelectMenu id="variety_id" control={control} options={varieties} labelText="Sorte" />
          <SelectMenu id="quantity" control={control} options={quantity} labelText="Menge" />
          <SimpleFormInput
            labelText="Herkunft"
            placeHolder="Billa"
            id="origin"
            register={register}
          />
          <SimpleFormInput
            labelText="Verbrauch bis"
            placeHolder="2024"
            id="use_by"
            register={register}
          />
          <SelectMenu id="quality" control={control} options={quality} labelText="Qualität" />
          <SimpleFormInput
            labelText="Geschmack"
            placeHolder="nussig"
            id="taste"
            register={register}
          />
          <SimpleFormInput labelText="Ertrag" placeHolder="1" id="yield_" register={register} />
          <SimpleFormInput labelText="Preis" placeHolder="2,99€" id="price" register={register} />
          <SimpleFormInput
            labelText="Generation"
            placeHolder="0"
            id="generation"
            //register={register}
          />
        </div>
        <div className="mb-6">
          <SimpleFormInput
            isArea={true}
            labelText="Notizen"
            placeHolder="..."
            id="notes"
            register={register}
          />
        </div>
        <div className="flex flex-row justify-between space-x-4">
          <button
            onClick={onCancel}
            className="max-w-[240px] grow rounded-lg border border-zinc-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-600 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            //onClick={() => onSubmit(newSeedDTO)}
            className="max-w-[240px] grow rounded-lg bg-gray-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
          >
            Eintragen
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSeedForm;
