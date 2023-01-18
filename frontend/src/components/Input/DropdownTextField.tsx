import { useState } from 'react';

export default function DropdownTextField() {
  const [active, setActive] = useState(false);

  return (
    <div className="flex justify-center">
      <div>
        <div className="dropdown relative">
          <button
            className="
          px-6 
          py-2.5
          bg-blue-600
          text-white
          font-medium
          text-xs
          leading-tight
          uppercase
          rounded
          shadow-md
          hover:bg-blue-700 hover:shadow-lg
          focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
          active:bg-blue-800 active:shadow-lg active:text-white
          transition
          duration-150 ease-in-out flex items-center whitespace-nowrap"
            type="button"
            onClick={() => {
              setActive(!active);
            }}
          >
            Dropdown button
            <svg
              focusable="false"
              data-prefix="fas"
              data-icon="caret-down"
              className="w-2 ml-2"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
              ></path>
            </svg>
          </button>
          <ul
            className="
        
          absolute
          bg-primary-textfield
          text-base
          z-50
          py-2
          list-none
          text-left
          rounded-lg
          shadow-lg
          mt-1
          bg-clip-padding
          border-none
          transition duration-250 ease-in-out
        "
            hidden={!active}
          >
            <li>
              <a
                className="
              dropdown-item
              text-sm
              py-2
              px-4
              font-normal
              block
              w-full
              whitespace-nowrap
              bg-transparent
              text-gray-700
              hover:bg-gray-100
            "
                href="#"
              >
                Action
              </a>
            </li>
            <li>
              <a
                className="
              dropdown-item
              text-sm
              py-2
              px-4
              font-normal
              block
              w-full
              whitespace-nowrap
              bg-transparent
              text-gray-700
              hover:bg-gray-100
            "
                href="#"
              >
                Another action
              </a>
            </li>
            <li>
              <a
                className="
              dropdown-item
              text-sm
              py-2
              px-4
              font-normal
              block
              w-full
              whitespace-nowrap
              bg-transparent
              text-gray-700
              hover:bg-gray-100
            "
                href="#"
              >
                Something else here
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
