import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectMenuProps<T extends FieldValues> {
  isMulti?: boolean;
  id: Path<T>;
  labelText?: string;
  control?: Control<T, unknown>;
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
  const customStyles: StylesConfig = {
    menu: (styles) => ({
      ...styles,
      backgroundColor: '#181818',
    }),
    control: (styles) => ({
      ...styles,
      height: '44px',
      backgroundColor: '#181818',
      borderRadius: '5px',
      border: '1px solid rgb(39 39 42);',
    }),
    option: (styles) => ({
      ...styles,
      color: 'white',
      backgroundColor: '#181818',
      ':hover': {
        backgroundColor: 'gray',
        color: 'white',
      },
    }),
    valueContainer: (styles) => ({
      ...styles,
      flexWrap: 'nowrap',
    }),
    singleValue: (styles) => ({
      ...styles,
      color: 'white',
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: '#232323',
      color: 'white',
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: 'white',
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      ':hover': {
        backgroundColor: 'gray',
        color: 'white',
      },
    }),
  };

  return (
    <div>
      {labelText && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium  text-white">
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
            required={required}
            onInputChange={onChange}
          />
        )}
      />
    </div>
  );
}
