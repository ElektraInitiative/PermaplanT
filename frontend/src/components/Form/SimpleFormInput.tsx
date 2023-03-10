import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import { HTMLInputTypeAttribute } from 'react';

interface SimpleFormInputProps<T extends FieldValues> {
  id: Path<T>;
  labelText: string;
  placeHolder: string;
  isArea?: boolean;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  value?: string | number | readonly string[];
  register?: UseFormRegister<T>;
  valueAsNumber?: boolean;
  errorTitle?: string;
}

export default function SimpleFormInput<T extends FieldValues>({
  labelText,
  placeHolder,
  required = false,
  isArea = false,
  type = 'text',
  value,
  id,
  register,
  valueAsNumber = false,
  errorTitle,
}: SimpleFormInputProps<T>) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium  text-white">
        {labelText}
        {required ? <span className="text-red-800"> *</span> : <></>}
      </label>
      {isArea ? (
        <textarea
          rows={6}
          name={id}
          id={id}
          className="block w-full rounded-lg border border-zinc-800 bg-primary-textfield p-2.5 text-sm text-white placeholder-neutral-700 focus:border-gray-600 focus:outline-none"
          placeholder={placeHolder}
          required={required}
          {...register?.(id)}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          className="block h-11 w-full rounded-lg border border-zinc-800 bg-primary-textfield p-2.5 text-sm text-white placeholder-neutral-700 focus:border-gray-600 focus:outline-none"
          placeholder={placeHolder}
          required={required}
          style={{ colorScheme: 'dark' }}
          pattern={valueAsNumber ? '^[0-9]+([,][0-9]{1,2})?$' : undefined}
          title={errorTitle}
          {...register?.(id, {
            valueAsNumber: type === 'number' || valueAsNumber,
          })}
        />
      )}
    </div>
  );
}
