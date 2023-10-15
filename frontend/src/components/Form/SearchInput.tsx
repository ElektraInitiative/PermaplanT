import { ReactComponent as SearchResetIcon } from '@/svg/icons/search-reset.svg';
import { ReactComponent as SearchIcon } from '@/svg/icons/search.svg';
import React, {
  forwardRef,
  KeyboardEvent,
  MutableRefObject,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export const SHORTCUT_SEARCH_INPUT_RESET = 'Escape';

export const TEST_IDS = Object.freeze({
  SEARCH_ICON: 'search-input__search-icon',
  SEARCH_INPUT: 'search-input__input-field',
  RESET_ICON: 'search-input__reset-icon',
});

export type SearchInputHandle = {
  focusSearchInputField: () => void;
};

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * UI Component representing a search input field.
 *
 * It consists of:
 * - The search input field itself
 * - A search icon as visual indicator for the search
 * - A search reset icon for clearing the search input field
 *
 * This search input component offers various functionalities:
 * - Calling the passed search handler function with the entered search term
 * - Clearing the search input field upon clicking on the reset icon
 * - Clearing the search input field upon pressing the _ESCAPE_ key
 * - Exposing the focusability of its search input field to parent components
 */
const SearchInput = forwardRef<SearchInputHandle, SearchInputProps>(
  ({ handleSearch, ...inputProps }, forwardedRef) => {
    const [searchTerm, setSearchTerm] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(
      forwardedRef,
      () => {
        return {
          focusSearchInputField() {
            searchInputRef.current?.focus();
          },
        };
      },
      [],
    );

    const shouldShowResetIcon = () => searchTerm.length > 0;

    const search = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      handleSearch(event);
    };

    const resetSearchByKey = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === SHORTCUT_SEARCH_INPUT_RESET) {
        resetSearch();
      }
    };

    const resetSearch = () => {
      const searchInputField = (searchInputRef as MutableRefObject<HTMLInputElement>).current;

      const clearSearchInputField = () => (searchInputField.value = '');
      const triggerNewSearch = () =>
        searchInputField.dispatchEvent(new Event('input', { bubbles: true }));

      if (searchInputField) {
        clearSearchInputField();
        triggerNewSearch();
        searchInputField.focus();
      }
    };

    return (
      <div className="relative grow">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon stroke="currentColor" data-testid={TEST_IDS.SEARCH_ICON} />
        </div>
        <input
          type="text"
          className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 pl-10 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:border-neutral-400 disabled:text-neutral-400 dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300 dark:disabled:border-neutral-400-dark dark:disabled:text-neutral-400-dark"
          data-testid={TEST_IDS.SEARCH_INPUT}
          value={searchTerm}
          ref={searchInputRef}
          {...inputProps}
          onInput={search}
          onKeyDown={resetSearchByKey}
        />
        {shouldShowResetIcon() && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <SearchResetIcon
              className="h-4 w-4 cursor-pointer stroke-secondary-600 dark:stroke-secondary-50"
              data-testid={TEST_IDS.RESET_ICON}
              onClick={resetSearch}
            />
          </div>
        )}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
export default SearchInput;
