import { HTMLInputTypeAttribute } from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface SimpleFormInputAreaProps<T extends FieldValues> extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: Path<T>; 
  labelText: string;
  register?: UseFormRegister<T>;
}

export default function SimpleFormAreaInput<T extends FieldValues> ({
  id, 
  labelText = '',
  register,
 ...props
}: SimpleFormInputAreaProps<T>) {
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
      <textarea
        id={id}
        {...props}
        {...register?.(id)}
        className="dark:bg-primary-textfield-dark block w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:bg-neutral-100-dark dark:focus:border-primary-300"
      />
    </div>
  );
}
