import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface SimpleFormInputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: Path<T>;
  labelText: string;
  register?: UseFormRegister<T>;
  valueAsNumber?: boolean;
  errorTitle?: string;
}

export default function SimpleFormInput<T extends FieldValues>({
  id,
  labelText = '',
  register,
  valueAsNumber = false,
  errorTitle,
  ...props
}: SimpleFormInputProps<T>) {
  // Extract the input fields value from the respective Events before calling onChange.
  /*  const callOnChange = function <E>(event: React.ChangeEvent<E> | React.KeyboardEvent<E>) {
    if (onChange == null) return;

    // If somebody finds a way of fixing the next line, please do!
    const value = (event.target as unknown as HTMLInputElement).value;

    if (type === 'number') {
      onChange(parseInt(value));
    }

    onChange(value);
  }; */

  return (
    <div className="dark:text-white">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {labelText}
        {props.required ? <span className="text-red-800"> *</span> : <></>}
      </label>
      <input
        id={id}
        title={errorTitle}
        {...props}
        {...register?.(id, {
          valueAsNumber: props.type === 'number' || valueAsNumber,
        })}
        className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300"
      />
    </div>
  );
}
