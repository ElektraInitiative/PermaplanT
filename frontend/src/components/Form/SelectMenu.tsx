import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import Select, {
  ActionMeta,
  ClassNamesConfig,
  GroupBase,
  MultiValue,
  SingleValue,
  StylesConfig,
} from 'react-select';
import filterObject from '../../utils/filterObject';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectMenuProps<
  T extends FieldValues,
  Option = SelectOption,
  IsMulti extends boolean = false,
> {
  /** Per page unique identifier of this UI element. */
  id: Path<T>;
  /** More than one option may be selected if this flag is set to true. */
  isMulti?: IsMulti;
  /** This text will be displayed in a label above select menu. */
  labelText?: string;
  /**
   * Reference to a react-hook-form control.
   * Caution: control can only be omitted in the context of a FormProvider.
   */
  control?: Control<T, unknown>;
  /** Options content that may be selected by the user */
  options: Option[];
  /** Force a selected option. */
  value?: Option;
  /** Whether the user has to select something before they can submit the containing form. */
  required?: boolean;
  /** Text that is displayed in place of the content if no option has been selected. */
  placeholder?: string;
  /** Callback that is invoked every time a new option is selected. */
  handleOptionsChange?: (
    option: SingleValue<Option> | MultiValue<Option>,
    actionMeta: ActionMeta<Option>,
  ) => void;
  /** Callback that is invoked if the user made any input. */
  onChange?: () => void;
  /** Callback that is invoked every time the user changed the search query. */
  onInputChange?: (inputValue: string) => void;
  /** Disables the x icon at the end of the select menu that allows the user to deselect the current option. */
  isClearable?: boolean;
}

/**
 * Allows the user to choose from a set of predetermined options.
 * Based on [react-select](https://react-select.com/home).
 */
export default function SelectMenu<
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
  value,
  placeholder,
  handleOptionsChange,
  onChange,
  onInputChange,
  isClearable = true,
}: SelectMenuProps<T, Option, IsMulti>) {
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
    menu: (styles) => filterObject(styles, ['backgroundColor', 'color']),
    control: (styles) =>
      filterObject(styles, [
        'border',
        'borderColor',
        'borderRadius',
        'boxShadow',
        'backgroundColor',
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
    <div data-testid={`select-menu__${labelText}-select`}>
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
          <Select
            name={id}
            onChange={handleOptionsChange}
            placeholder={placeholder}
            inputValue={inputValue}
            options={options}
            value={value}
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
            isClearable={isClearable}
          />
        )}
      />
    </div>
  );
}
