import { SelectOption } from './SelectMenu';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { ClassNamesConfig, StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import filterObject from '@/utils/filterObject';

export interface CreatableSelectMenuProps<T extends FieldValues> {
  isMulti?: boolean;
  id: Path<T>;
  labelText?: string;
  control?: Control<T, unknown>;
  options: SelectOption[];
  required?: boolean;
  placeholder?: string;
  handleOptionsChange?: (option: any) => void;
  handleCreate?: (inputValue: string) => void;
  onChange?: () => void;
}

export default function CreatableSelectMenu<T extends FieldValues>({
  isMulti = false,
  id,
  labelText,
  control,
  options,
  required = false,
  placeholder,
  handleOptionsChange,
  handleCreate,
  onChange,
}: CreatableSelectMenuProps<T>) {
  const customClassNames: ClassNamesConfig = {
    menu: () => 'bg-neutral-100 dark:bg-neutral-50-dark',
    control: (state) => {
      return `
        h-[44px] bg-neutral-200 rounded border 
        dark:bg-neutral-50-dark focus:border-primary-500
        hover:border-primary-500 dark:focus:border-primary-500 dark:hover:border-primary-500
        ${state.isFocused ? " border-primary-500 dark:border-primary-500" : " dark:border-neutral-400-dark border-neutral-500"}
      `
    },
    option: (state) => {
      return `
        hover:bg-neutral-200 dark:hover:bg-neutral-400-dark
        ${state.isFocused ? ' bg-neutral-300 dark:bg-neutral-500' : ''}
        ${state.isSelected ? ' bg-primary-500' : ''}
      `
    },
    valueContainer: () => 'flex-nowrap',
    multiValue: () => 'bg-neutral-400 dark:bg-neutral-400-dark',
    multiValueRemove: () => 'hover:bg-neutral-500',
  };
  const customStyles: StylesConfig = {
    // remove css attributes from predefined styles
    // this needs to be done so the custom css classes take effect
    control: (styles) => filterObject(styles, ["border", "borderColor", "borderRadius", "boxShadow", "color", "&:hover"]),
    option: (styles) => filterObject(styles, ["backgroundColor", "color"]),
    singleValue: (styles) => filterObject(styles, ["color"]),
    multiValue: (styles) => filterObject(styles, ["color"]),
    multiValueLabel: (styles) => filterObject(styles, ["color"]),
    multiValueRemove: (styles) => filterObject(styles, ["color"]),
  };

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
        render={({ field }) => (
          <CreatableSelect
            name={id}
            isClearable
            onChange={handleOptionsChange}
            onCreateOption={handleCreate}
            placeholder={placeholder}
            options={options}
            isMulti={isMulti}
            styles={customStyles}
            classNames={customClassNames}
            required={required}
            onInputChange={onChange}
          />
        )}
      />
    </div>
  );
}
