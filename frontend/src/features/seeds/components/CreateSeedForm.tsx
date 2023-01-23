import { FormEvent, useEffect, useState } from 'react';
import {
  NewSeedDTO,
  Quality,
  Quantity,
  Tag,
  VarietyDto,
} from '../../../bindings/rust_ts_definitions';
import SelectMenu, { SelectOption } from '../../../components/Select/SelectMenu';
import { SubmitHandler, useForm } from 'react-hook-form';

import SimpleFormInput from '@/components/Input/SimpleFormInput';
import { findAllVarieties } from '../api/findAllVarieties';

interface CreateSeedFormProps {
  onCancel: () => void;
  onSubmit: (newSeedDTO: NewSeedDTO) => void;
}

const CreateSeedForm = ({ onCancel, onSubmit }: CreateSeedFormProps) => {
  const { register, handleSubmit, control } = useForm<NewSeedDTO>();
  const onFormSubmit: SubmitHandler<NewSeedDTO> = (data) => onSubmit(data);

  const tags: SelectOption[] = Object.values(Tag).map((element) => {
    return { value: element, label: element };
  });

  const [varieties, setVarieties] = useState<SelectOption[]>([]);

  const quality: SelectOption[] = Object.values(Quality).map((element) => {
    return { value: element, label: element };
  });

  const quantity: SelectOption[] = Object.values(Quantity).map((element) => {
    return { value: element, label: element };
  });

  useEffect(() => {
    const onSuccess = (varieties: VarietyDto[]) => {
      setVarieties(
        varieties.map((element) => {
          return { value: element.id, label: element.species };
        }),
      );
    };

    const onError = (error: Error) => {};
    findAllVarieties(onSuccess, onError);
  }, []);

  const newSeed: NewSeedDTO = {
    id: undefined,
    name: '',
    variety_id: -1,
    harvest_year: 2023,
    quantity: Quantity.Enough,
    tags: [],
    use_by: undefined,
    origin: undefined,
    taste: undefined,
    yield_: undefined,
    generation: undefined,
    quality: undefined,
    price: undefined,
    notes: undefined,
  };

  const handleTagsChange = (option: any) => {
    const temp = option as SelectOption[];
    const mapped = temp.map((element) => element.value as Tag);
    newSeed.tags = mapped;
  };

  const handleQuantityChange = (option: any) => {
    const temp = option as SelectOption;
    const mapped = temp.value as Quantity;
    newSeed.quantity = mapped;
  };

  const handleQualityChange = (option: any) => {
    const temp = option as SelectOption;
    const mapped = temp.value as Quality;
    newSeed.quality = mapped;
  };

  const handleVarietyChange = (option: any) => {
    const temp = option as SelectOption;
    console.log(temp);
    const mapped = Number(temp.value);
    newSeed.variety_id = mapped;
  };

  const handleNameChange = (event: FormEvent<HTMLInputElement>) => {
    const temp = event.currentTarget.value;
    newSeed.name = temp;
  };

  const handleHarvestYearChange = (event: FormEvent<HTMLInputElement>) => {
    const temp = Number(event.currentTarget.value);
    newSeed.harvest_year = temp;
  };

  const handleOriginChange = (event: FormEvent<HTMLInputElement>) => {
    const temp = event.currentTarget.value;
    newSeed.origin = temp;
  };

  const handleUseByChange = (event: FormEvent<HTMLInputElement>) => {
    const dateString = new Date(event.currentTarget.value).toISOString().split('T')[0];
    newSeed.use_by = dateString;
  };

  const handleYieldChange = (event: FormEvent<HTMLInputElement>) => {
    const temp = event.currentTarget.value;
    newSeed.yield_ = temp;
  };

  const handlePriceChange = (event: FormEvent<HTMLInputElement>) => {
    const temp = Number(event.currentTarget.value);
    newSeed.price = temp;
  };

  const handleGenerationChange = (event: FormEvent<HTMLInputElement>) => {
    const temp = Number(event.currentTarget.value);
    newSeed.generation = temp;
  };

  const handleNotesChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const temp = event.currentTarget.value;
    newSeed.notes = temp;
  };

  const handleTasteChange = (event: FormEvent<HTMLInputElement>) => {
    const temp = event.currentTarget.value;
    newSeed.taste = temp;
  };

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(newSeed);
  };

  return (
    <div>
      <form onSubmit={submitForm}>
        <div className="mb-6 grid gap-8 md:grid-cols-2">
          <SimpleFormInput
            type="number"
            labelText="Bezugsjahr"
            placeHolder="2023"
            required={true}
            id="harvest_year"
            handleInputChange={handleHarvestYearChange}
          />
          <SelectMenu
            id="tags"
            control={control}
            isMulti={true}
            options={tags}
            labelText="Kategorie"
            required={true}
            handleOptionsChange={handleTagsChange}
          />
          <SimpleFormInput
            labelText="Art"
            placeHolder="Feldsalat"
            required={true}
            id="name"
            handleInputChange={handleNameChange}
          />
          <SelectMenu
            id="variety_id"
            control={control}
            options={varieties}
            labelText="Sorte"
            required={true}
            handleOptionsChange={handleVarietyChange}
          />
          <SelectMenu
            id="quantity"
            control={control}
            options={quantity}
            labelText="Menge"
            required={true}
            handleOptionsChange={handleQuantityChange}
          />
          <SimpleFormInput
            labelText="Herkunft"
            placeHolder="Billa"
            id="origin"
            handleInputChange={handleOriginChange}
          />
          <SimpleFormInput
            labelText="Verbrauch bis"
            placeHolder="2024"
            id="use_by"
            handleInputChange={handleUseByChange}
          />
          <SelectMenu
            id="quality"
            control={control}
            options={quality}
            labelText="Qualität"
            handleOptionsChange={handleQualityChange}
          />
          <SimpleFormInput
            labelText="Geschmack"
            placeHolder="nussig"
            id="taste"
            handleInputChange={handleTasteChange}
          />
          <SimpleFormInput
            labelText="Ertrag"
            placeHolder="1"
            id="yield_"
            handleInputChange={handleYieldChange}
          />
          <SimpleFormInput
            type="number"
            labelText="Preis"
            placeHolder="2,99€"
            id="price"
            handleInputChange={handlePriceChange}
          />
          <SimpleFormInput
            type="number"
            labelText="Generation"
            placeHolder="0"
            id="generation"
            handleInputChange={handleGenerationChange}
          />
        </div>
        <div className="mb-6">
          <SimpleFormInput
            isArea={true}
            labelText="Notizen"
            placeHolder="..."
            id="notes"
            register={register}
            handleTextAreaChange={handleNotesChange}
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
