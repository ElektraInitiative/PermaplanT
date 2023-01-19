import { HTMLInputTypeAttribute } from 'react';

interface FormFieldOptions {
  forText: string;
  labelText: string;
  placeHolder: string;
  isArea?: boolean;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
}

export default function SimpleTextField({
  labelText,
  placeHolder,
  required = false,
  isArea = false,
  type = 'text',
  forText,
}: FormFieldOptions) {
  return (
    <div>
      <label htmlFor={forText} className="mb-2 block text-sm font-medium  text-white">
        {labelText}
        {required ? <span className="text-red-800"> *</span> : <></>}
      </label>
      {isArea ? (
        <textarea
          id={forText}
          className="block w-full rounded-lg border border-zinc-800 bg-primary-textfield p-2.5 text-sm text-white placeholder-neutral-700 focus:border-gray-600 focus:outline-none"
          placeholder={placeHolder}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={forText}
          className="block w-full rounded-lg border border-zinc-800 bg-primary-textfield p-2.5 text-sm text-white placeholder-neutral-700 focus:border-gray-600 focus:outline-none"
          placeholder={placeHolder}
          required={required}
        />
      )}
    </div>
  );
}
