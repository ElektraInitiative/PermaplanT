import { HTMLInputTypeAttribute } from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface SimpleFormInputProps<T extends FieldValues> {
  id: Path<T>;
  labelText: string;
  placeHolder?: string;
  isArea?: boolean;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  defaultValue?: string | number | readonly string[];
  min?: number;
  max?: number;
  register?: UseFormRegister<T>;
  onChange?: () => void;
  valueAsNumber?: boolean;
  errorTitle?: string;
  disabled?: boolean;
  value?: string;
}

export default function SimpleFormInput<T extends FieldValues>({
  labelText,
  placeHolder = '',
  required = false,
  isArea = false,
  type = 'text',
  defaultValue,
  min,
  max,
  id,
  register,
  onChange,
  valueAsNumber = false,
  errorTitle,
  disabled = false,
  value,
}: SimpleFormInputProps<T>) {
  return (
    <div className='dark:text-white'>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {labelText}
        {required ? <span className="text-red-800"> *</span> : <></>}
      </label>
      {isArea ? (
        <textarea
          disabled={disabled}
          onKeyUp={onChange}
          rows={6}
          name={id}
          id={id}
          className="block w-full rounded-lg border border-neutral-500 bg-neutral-100 dark:bg-neutral-100-dark dark:bg-primary-textfield-dark p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none"
          placeholder={placeHolder}
          required={required}
          {...register?.(id)}
        />
      ) : (
        <input
          disabled={disabled}
          onKeyUp={onChange}
          type={type}
          min={min}
          max={max}
          id={id}
          defaultValue={defaultValue}
          className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 dark:bg-neutral-50-dark dark:border-neutral-400-dark p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none"
          placeholder={placeHolder}
          required={required}
          style={{ colorScheme: 'dark' }}
          pattern={valueAsNumber ? '^[0-9]+([,][0-9]{1,2})?$' : undefined}
          title={errorTitle}
          value={value?.toString()}
          {...register?.(id, {
            valueAsNumber: type === 'number' || valueAsNumber,
          })}
        />
      )}
    </div>
  );
}
