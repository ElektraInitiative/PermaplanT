import filterObject from '../../utils/filterObject';
import { SelectOption } from './SelectMenuTypes';
import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import type { ClassNamesConfig, StylesConfig, GroupBase } from 'react-select';
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate';

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
  pageNumber: number;
}

export interface PaginatedSelectMenuProps<
  T extends FieldValues,
  Option = SelectOption,
  IsMulti extends boolean = false,
> {
  /** When this boolean flag is set to true, the user may select multiple options at once (default false).*/
  isMulti?: IsMulti;
  /** Unique name of this component.*/
  id: Path<T>;
  /** Short description that will be displayed above the input field if set.*/
  labelText?: string;
  /** React hook form control (See https://www.react-hook-form.com/api/useform/control/ for further information).*/
  control?: Control<T, unknown>;
  /** If set to true, the user has to select an option before the form can be completed (default false).*/
  required?: boolean;
  /**
   * Forces a selected option.
   * If this option is set, the component will always display its value regardless of user input.
   */
  value?: Option;
  /** Text that is displayed instead of the input if it has not been selected yet.*/
  placeholder?: string;
  /** Maximum time interval between two inputs (in milliseconds) before they are considered separate inputs. */
  debounceTimeout?: number;
  /** Function for loading a page of options. */
  loadOptions: LoadOptions<Option, GroupBase<Option>, PageAdditionalInfo>;
  /** Callback that is invoked every time the user selects a new option. The single argument represents the selected option.*/
  handleOptionsChange?: (option: unknown) => void;
  /** This callback gets executed if any input was made by the user */
  onChange?: () => void;
}

/**
 * Like SelectMenu but with added pagination using react-select-async-paginate.
 */
export default function PaginatedSelectMenu<
  T extends FieldValues,
  Option = SelectOption,
  IsMulti extends boolean = false,
>({
  isMulti = false as IsMulti,
  id,
  labelText,
  control,
  required = false,
  value,
  placeholder,
  loadOptions,
  handleOptionsChange,
  onChange,
  debounceTimeout,
}: PaginatedSelectMenuProps<T, Option, IsMulti>) {
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

  const [inputValue, setInputValue] = useState('');
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

  return (
    <div data-testid={`paginated-select-menu__${labelText}`}>
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
          <AsyncPaginate<Option, GroupBase<Option>, PageAdditionalInfo, IsMulti>
            debounceTimeout={debounceTimeout}
            name={id}
            loadOptions={loadOptions}
            isClearable
            inputValue={inputValue}
            onChange={handleOptionsChange}
            styles={customStyles}
            placeholder={placeholder}
            isMulti={isMulti}
            classNames={customClassNames}
            value={value}
            required={required}
            onInputChange={(value, event) => {
              // prevent the text from disapearing when clicking inside the input field
              if (event.action === 'input-change' || event.action === 'set-value') {
                setInputValue(value);
              }
              onChange?.();
            }}
          />
        )}
      />
    </div>
  );
}
