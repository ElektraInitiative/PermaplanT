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
    <div>
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
          className="block w-full rounded-lg border border-zinc-800 bg-primary-textfield dark:bg-primary-textfield-dark p-2.5 text-sm placeholder-neutral-700 focus:border-gray-600 focus:outline-none"
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
          className="block h-11 w-full rounded-lg border border-zinc-800 bg-primary-textfield dark:bg-primary-textfield-dark p-2.5 text-sm placeholder-neutral-700 focus:border-gray-600 focus:outline-none"
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
