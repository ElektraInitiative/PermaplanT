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
      <label htmlFor={forText} className="block mb-2 text-sm font-medium  text-white">
        {labelText}
        {required ? <span className="text-red-800"> *</span> : <></>}
      </label>
      {isArea ? (
        <textarea
          id={forText}
          className="bg-primary-textfield border text-sm rounded-lg block w-full p-2.5 border-zinc-800 focus:outline-none placeholder-neutral-700 text-white focus:border-gray-600"
          placeholder={placeHolder}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={forText}
          className="bg-primary-textfield border text-sm rounded-lg block w-full p-2.5 border-zinc-800 focus:outline-none placeholder-neutral-700 text-white focus:border-gray-600"
          placeholder={placeHolder}
          required={required}
        />
      )}
    </div>
  );
}
