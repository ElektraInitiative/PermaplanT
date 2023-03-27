interface SearchInputProps {
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ handleSearch }: SearchInputProps) => {
  return (
    <div className="relative grow">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          aria-hidden="true"
          className="h-5 w-5 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <input
        type="search"
        className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-primary-textfield dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 md:w-[400px]"
        placeholder="Search seeds..."
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchInput;
