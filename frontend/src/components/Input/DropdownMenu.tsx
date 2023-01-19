import { useState } from 'react';

interface DropdownOptions {
  options: string[];
  forText: string;
  placeHolder: string;
  required?: boolean;
}

export default function DropdownMenu({
  options,
  forText,
  placeHolder,
  required = false,
}: DropdownOptions) {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const onSelect = (index: number) => {
    setSelectedOption(options[index]);
  };

  return (
    <div>
      <label htmlFor={forText} className="mb-2 block text-sm font-medium  text-white">
        {selectedOption}
        {required ? <span className="text-red-800"> *</span> : <></>}
      </label>
      <div>
        <select
          className="w-full rounded-lg border border-zinc-800 bg-primary-textfield p-2.5 text-sm text-white placeholder-neutral-700 focus:border-gray-600 focus:outline-none "
          placeholder={placeHolder}
        >
          {options.map((option, index) => (
            <option
              key={option}
              onClick={() => {
                onSelect(index);
              }}
            >
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
