import { SelectOption } from './SelectMenu';
import filterObject from '@/utils/filterObject';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  ActionMeta,
  ClassNamesConfig,
  GroupBase,
  MultiValue,
  SingleValue,
  StylesConfig,
} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {useState} from 'react';

export interface CreatableSelectMenuProps<
  T extends FieldValues,
  Option = SelectOption,
  IsMulti extends boolean = false,
> {
  isMulti?: IsMulti;
  id: Path<T>;
  labelText?: string;
  control?: Control<T, unknown>;
  options: Option[];
  required?: boolean;
  placeholder?: string;
  handleOptionsChange?: (
    option: SingleValue<Option> | MultiValue<Option>,
    actionMeta: ActionMeta<Option>,
  ) => void;
  handleCreate?: (inputValue: string) => void;
  onChange?: () => void;
  onInputChange?: (inputValue: string) => void;
}

export default function CreatableSelectMenu<
  T extends FieldValues,
  Option = SelectOption,
  IsMulti extends boolean = false,
>({
  isMulti = false as IsMulti,
  id,
  labelText,
  control,
  options,
  required = false,
  placeholder,
  handleOptionsChange,
  handleCreate,
  onChange,
  onInputChange,
}: CreatableSelectMenuProps<T, Option, IsMulti>) {
  const customClassNames: ClassNamesConfig<Option, IsMulti, GroupBase<Option>> = {
    menu: () => 'bg-neutral-100 dark:bg-neutral-50-dark',
    control: (state) => {
      return `
        h-[44px] bg-neutral-200 rounded border
        dark:bg-neutral-50-dark focus:border-primary-500
        hover:border-primary-500 dark:focus:border-primary-300 dark:hover:border-primary-300
        ${
          state.isFocused
            ? ' border-primary-500 dark:border-primary-300'
            : ' dark:border-neutral-400-dark border-neutral-500'
        }
      `;
    },
    option: (state) => {
      return `
        hover:bg-neutral-200 dark:hover:bg-neutral-400-dark
        ${state.isFocused ? ' bg-neutral-300 dark:bg-neutral-500' : ''}
        ${state.isSelected ? ' bg-primary-500' : ''}
      `;
    },
    valueContainer: () => 'flex-nowrap',
    multiValue: () => 'bg-neutral-400 dark:bg-neutral-400-dark',
    multiValueRemove: () => 'hover:bg-neutral-500',
  };
  const customStyles: StylesConfig<Option, IsMulti, GroupBase<Option>> = {
    // remove css attributes from predefined styles
    // this needs to be done so the custom css classes take effect
    control: (styles) =>
      filterObject(styles, [
        'border',
        'borderColor',
        'borderRadius',
        'boxShadow',
        'color',
        '&:hover',
      ]),
    option: (styles) => filterObject(styles, ['backgroundColor', 'color']),
    singleValue: (styles) => filterObject(styles, ['color']),
    multiValue: (styles) => filterObject(styles, ['color']),
    multiValueLabel: (styles) => filterObject(styles, ['color']),
    multiValueRemove: (styles) => filterObject(styles, ['color']),
  };

  const [inputValue, setInputValue] = useState('');
  
  return (
    <div>
      {labelText && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-white">
          {labelText}
          {required ? <span className="text-red-800"> *</span> : <></>}
        </label>
      )}

      <Controller
        name={id}
        control={control}
        render={() => (
          <CreatableSelect
            name={id}
            isClearable
            onChange={handleOptionsChange}
            onCreateOption={handleCreate}
            inputValue={inputValue}
            placeholder={placeholder}
            options={options}
            isMulti={isMulti}
            styles={customStyles}
            classNames={customClassNames}
            required={required}
            onInputChange={(value, event) => {
              // prevent the text from disapearing when clicking inside the input field
              if (event.action === 'input-change' || event.action === 'set-value') {
                setInputValue(value);
              }
              onChange?.();
              onInputChange?.(value);
            }}
          />
        )}
      />
    </div>
  );
}
