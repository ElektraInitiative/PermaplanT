import filterObject from '@/utils/filterObject';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import { ClassNamesConfig  } from 'react-select/dist/declarations/src/styles';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectMenuProps<TFieldValues extends FieldValues> {
  isMulti?: boolean;
  id: Path<TFieldValues>;
  labelText?: string;
  control?: Control<TFieldValues, unknown>;
  options: SelectOption[];
  required?: boolean;
  placeholder?: string;
  handleOptionsChange?: (option: any) => void;
  onChange?: () => void;
}

export default function SelectMenu<T extends FieldValues>({
  isMulti = false,
  id,
  labelText,
  control,
  options,
  required = false,
  placeholder,
  handleOptionsChange,
  onChange,
}: SelectMenuProps<T>) {
  const customClassNames: ClassNamesConfig = {
    menu: () => 'bg-background-100 dark:bg-background-50-dark',
    control: (state) => {
      return `
        h-[44px] bg-background-200 rounded border 
        dark:bg-background-50-dark focus:border-primary-500
        hover:border-primary-500 dark:focus:border-primary-500 dark:hover:border-primary-500
        ${state.isFocused ? " border-primary-500 dark:border-primary-500" : " dark:border-background-400-dark border-background-500"}
      `
    },
    option: (state) => {
      return `
        hover:bg-background-200 dark:hover:bg-background-400-dark
        ${state.isFocused ? ' bg-background-300 dark:bg-background-500' : ''}
        ${state.isSelected ? ' bg-primary-500' : ''}
      `
    },
    valueContainer: () => 'flex-nowrap',
    multiValue: () => 'bg-background-400 dark:bg-background-400-dark',
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
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {labelText}
          {required ? <span className="text-red-800"> *</span> : <></>}
        </label>
      )}

      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <Select
            name={id}
            isClearable
            onChange={handleOptionsChange}
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
