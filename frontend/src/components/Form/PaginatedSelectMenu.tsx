import { SelectOption } from './SelectMenu';
import filterObject from '@/utils/filterObject';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { GroupBase, StylesConfig } from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import { ClassNamesConfig } from 'react-select/dist/declarations/src/styles';

/**
 * Contains the information needed by react-select-async-paginate for loading a single page.
 * See https://github.com/vtaits/react-select-async-paginate/tree/master/packages/react-select-async-paginate#loadoptions for more information.
 */
export interface Page {
  options: SelectOption[];
  hasMore: boolean;
  additional: PageAdditionalInfo;
}

/**
 * All values that are neither options nor the hasMore flag are required to be inside an object that implements this interface.
 * See https://github.com/vtaits/react-select-async-paginate/tree/master/packages/react-select-async-paginate#loadoptions for more information.
 */
export interface PageAdditionalInfo {
  page: number;
}

export interface PaginatedSelectMenuProps<
  T extends FieldValues,
  IsMulti extends boolean = false,
> {
  isMulti?: IsMulti;
  id: Path<T>;
  labelText?: string;
  control?: Control<T, unknown>;
  required?: boolean;
  placeholder?: string;
  debounceTimeout?: number;
  loadOptions: (
    search: string,
    old_options: unknown,
    additional: PageAdditionalInfo | undefined,
  ) => Promise<Page>;
  handleOptionsChange?: (option: unknown) => void;
  onChange?: () => void;
  onInputChange?: (inputValue: string) => void;
}

export default function SelectMenu<
  T extends FieldValues,
  IsMulti extends boolean = false,
>({
  isMulti = false as IsMulti,
  id,
  labelText,
  control,
  required = false,
  placeholder,
  loadOptions,
  handleOptionsChange,
  onChange,
  onInputChange,
}: PaginatedSelectMenuProps<T, IsMulti>) {
  const customClassNames: ClassNamesConfig = {
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

  const customStyles: StylesConfig<unknown, IsMulti, GroupBase<unknown>> = {
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
        render={() => (
          <AsyncPaginate
            name={id}
            loadOptions={loadOptions}
            isClearable
            onChange={handleOptionsChange}
            styles={customStyles}
            placeholder={placeholder}
            isMulti={isMulti}
            classNames={customClassNames}
            required={required}
            onInputChange={(inputValue) => {
              onChange?.();
              onInputChange?.(inputValue);
            }}
          />
        )}
      />
    </div>
  );
}
