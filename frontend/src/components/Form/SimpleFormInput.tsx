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
  onChange?: (value: string | number) => void;
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
  // Extract the input fields value from the respective Events before calling onChange.
  const callOnChange = function <E>(event: React.ChangeEvent<E> | React.KeyboardEvent<E>) {
    if (onChange == null) return;

    // If somebody finds a way of fixing the next line, please do!
    const value = (event.target as unknown as HTMLInputElement).value;

    if (type === 'number') {
      onChange(parseInt(value));
    }

    onChange(value);
  };

  return (
    <div className="dark:text-white">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {labelText}
        {required ? <span className="text-red-800"> *</span> : <></>}
      </label>
      {isArea ? (
        <textarea
          disabled={disabled}
          onKeyUp={(event) => callOnChange(event)}
          onChange={(event) => callOnChange(event)}
          rows={6}
          name={id}
          id={id}
          className="dark:bg-primary-textfield-dark block w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:bg-neutral-100-dark dark:focus:border-primary-300"
          placeholder={placeHolder}
          required={required}
          {...register?.(id)}
        />
      ) : (
        <input
          disabled={disabled}
          onKeyUp={(event) => callOnChange(event)}
          onChange={(event) => callOnChange(event)}
          type={type}
          min={min}
          max={max}
          id={id}
          defaultValue={defaultValue}
          className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
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
