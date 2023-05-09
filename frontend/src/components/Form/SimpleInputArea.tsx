import { HTMLInputTypeAttribute } from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface SimpleFormInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  labelText: string;
}

export default function SimpleFormInput ({
  labelText = '',
  ...props
}: SimpleFormInputProps) {
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
      <label htmlFor={props.id} className="mb-2 block text-sm font-medium">
        {labelText}
        {props.required ? <span className="text-red-800"> *</span> : <></>}
      </label>
      <textarea
        {...props}
      />
    </div>
  );
}
