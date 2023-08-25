import { ReactComponent as SearchIcon } from '@/icons/search.svg';
import { forwardRef, Ref } from 'react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** input event handler */
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = forwardRef(
  ({ handleSearch, ...inputProps }: SearchInputProps, ref: Ref<HTMLInputElement>) => {
    return (
      <div className="relative grow">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon stroke="currentColor" />
        </div>
        <input
          onChange={handleSearch}
          ref={ref}
          {...inputProps}
          type="search"
          className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 pl-10 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:border-neutral-400 disabled:text-neutral-400 dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300 dark:disabled:border-neutral-400-dark dark:disabled:text-neutral-400-dark"
        />
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
export default SearchInput;
