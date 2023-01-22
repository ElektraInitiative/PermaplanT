import DropdownListItem from './DropdownListItem';
import SimpleButton from '../../Button/SimpleButton';
import { useState } from 'react';

interface DropdownOptions {
  options: string[];
  forText: string;
  placeHolder: string;
  labelText: string;
  required?: boolean;
  multiple?: boolean;
}

export default function DropdownMenu({
  options,
  forText,
  placeHolder,
  labelText,
  required = false,
  multiple = false,
}: DropdownOptions) {
  const [selectedOptions, setSelectedOptions] = useState([options[0]]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectItem = (option: string) => {
    if (!multiple) {
      setSelectedOptions([option]);
      setShowDropdown(!showDropdown);
    } else {
      if (selectedOptions.includes(option)) {
        if (selectedOptions.length > 1) {
          setSelectedOptions(selectedOptions.filter((item) => item !== option));
        }
      } else {
        setSelectedOptions((arr) => [...arr, option]);
      }
    }
  };

  const selectItems = (options: [string]) => {
    setSelectedOptions(options);
  };

  return (
    <div>
      <label htmlFor={forText} className="mb-2 block text-sm font-medium text-white">
        {labelText}
        {required ? <span className="text-red-800"> *</span> : <></>}
      </label>

      <div className="relative">
        <SimpleButton onClick={toggleDropdown} title={selectedOptions[0]}>
          {showDropdown ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" width="24">
              <path d="M7.375 15.875 5.5 14 12 7.5l6.5 6.5-1.875 1.875L12 11.25Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" width="24">
              <path d="m12 15.875-6.5-6.5L7.375 7.5 12 12.125 16.625 7.5 18.5 9.375Z" />{' '}
            </svg>
          )}
        </SimpleButton>
        <div
          className={showDropdown ? ' fixed inset-0 h-full w-full cursor-default' : 'hidden'}
          onClick={toggleDropdown}
        />
        <ul
          className={
            showDropdown
              ? 'absolute z-50 mt-2 w-full rounded-lg bg-primary-button py-2 shadow-md'
              : 'hidden'
          }
        >
          {options.map((option) => (
            <DropdownListItem
              key={option}
              text={option}
              selected={selectedOptions.includes(option)}
              onClick={() => {
                selectItem(option);
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
