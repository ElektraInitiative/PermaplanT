import { useState } from 'react';
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
import filterObject from '../../utils/filterObject';
import { SelectOption } from './SelectMenuTypes';

export interface CreatableSelectMenuProps<
  T extends FieldValues,
  Option = SelectOption,
  IsMulti extends boolean = false,
> {
  /** When this boolean flag is set to true, the user may select multiple options at once (default false).                                                                          */
  isMulti?: IsMulti;
  /** Unique name of this component.                                                                                                                                                */
  id: Path<T>;
  /** Short description that will be displayed above the input field if set.                                                                                                        */
  labelText?: string;
  /** React hook form control (See https://www.react-hook-form.com/api/useform/control/ for further information).                                                                   */
  control?: Control<T, unknown>;
  /** Options that can be selected by the user. I.e. the contents of this component.                                                                                                */
  options: Option[];
  /** If set to true, the user has to select an option before the form can be completed (default false).                                                                            */
  required?: boolean;
  /** Text that is displayed instead of the input if it has not been selected yet.                                                                                                  */
  placeholder?: string;
  /** Callback that is invoked every time the user selects a new option. The single argument represents the selected option.                                                        */
  handleOptionsChange?: (
    option: SingleValue<Option> | MultiValue<Option>,
    actionMeta: ActionMeta<Option>,
  ) => void;
  /** Gets called if a new item was created with the users input as the only argument. If not set, the component will automatically add all created items to the available options. */
  handleCreate?: (inputValue: string) => void;
  /** Callback that is invoked if the user performs ANY input. This includes type and click events among others.                                                                    */
  onChange?: () => void;
  /** Callback that is invoked if the fields content changes. */
  onInputChange?: (inputValue: string) => void;
}

/**
 * Similar to SelectMenu, but allows the user to create new menu entries.
 * @param props.isMulti: When this boolean flag is set to true, the user may select multiple options at once (default false).
 * @param props.id: Unique name of this component.
 * @param props.labelText: Short description that will be displayed above the input field if set.
 * @param props.control: React hook form control (See https://www.react-hook-form.com/api/useform/control/ for further information).
 * @param props.options: Options that can be selected by the user. I.e. the contents of this component.
 * @param props.required: If set to true, the user has to select an option before the form can be completed (default false).
 * @param props.placeholder: Text that is displayed instead of the input if it has not been selected yet.
 * @param props.handleOptionsChange: Callback that is invoked every time the user selects a new option. The single argument represents the selected option.
 * @param props.handleCreate: Gets called if a new item was created with the users input as the only argument. If not set, the component will automatically add all created items to the available options.
 * @param props.onChange: Callback that is invoked if the user performs ANY input. This includes type and click events among others.
 * @param props.onInputChange: Callback that is invoked if the fields content changes.
 */
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
