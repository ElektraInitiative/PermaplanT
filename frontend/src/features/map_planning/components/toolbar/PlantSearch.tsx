import IconButton from '@/components/Button/IconButton';
import SearchInput from '@/components/Form/SearchInput';
import { searchPlants } from '@/features/seeds/api/searchPlants';
import { ReactComponent as PlantIcon } from '@/icons/plant.svg';
import { ReactComponent as SearchIcon } from '@/icons/search.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** UI component intended for searching plants that can be drag and dropped to the plants layer */
export const PlantSearch = () => {
  const { t } = useTranslation(['plantSearch']);

  const [plants, setPlants] = useState<string[]>([]);
  const [searchTerm, setSearchTerm]   = useState('');
  // Keep track of which search page should be requested next.
  // NOTE: pages start at index 1.
  const [nextPage, setNextPage]       = useState(1);
  // How far the user has scrolled in the search result list.
  const [searchScrollPos, setSearchScrollPos]   = useState(1);
  const [searchVisible, setSearchVisible] = useState(false);
  
  const searchResultsRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
    
    // Load plants even if the user didn't make any inputs.
    const loadInitalPage = setTimeout(() => {
      loadPage(1);
      setNextPage(2);
    }, 300);

    return () => clearTimeout(loadInitalPage);
  }, [searchVisible]);
  
  // If the user inputs a new search term, the frontend should display the first page of the search request.
  useEffect(() => {
    // Debounce plant search.
    const loadInitalPage = setTimeout(() => {
      loadPage(1);
      setNextPage(2);
    }, 300);

    return () => clearTimeout(loadInitalPage);
  }, [searchTerm]);

  // When the user scrolls past a certain threshold with a new page is supposed to be loaded.
  useEffect(() => {
    const scrollHeight = searchResultsRef.current?.scrollHeight;
    const offsetHeight = searchResultsRef.current?.offsetHeight;

    // Values may be undefined before the user clicked the search button.
    if (scrollHeight === undefined || offsetHeight === undefined)
      return;

    // Start loading the next page 100 pixels before the actual bottom of the page
    // to allow for smoother page transitions.
    const pageLoadThreshold = scrollHeight - offsetHeight - 100;
    if (searchScrollPos < pageLoadThreshold)
      return;

    // Debounce page fetching
    const loadInitalPage = setTimeout(() => {
      loadPage(nextPage + 1);
    }, 300);

    return () => {
      clearTimeout(loadInitalPage);
      // Only load the next page if the current page has been loaded successfully.
      setNextPage(nextPage + 1);
    };
  }, [searchScrollPos]);
  
  // Callback that recalculates the scroll position after the 
  // user made a scroll input.
  const onSearchResultsScroll = () => {
    const scrollOffset = searchResultsRef.current?.scrollTop;
    if (scrollOffset === undefined)
      throw new Error('Undefined search result list properties.'); 

    setSearchScrollPos(scrollOffset);
  };
   
  const loadPage = async (pageNum: number) => {
    const page = await searchPlants(searchTerm, nextPage);
    
    if (nextPage > page.total_pages) {
        return;
    }

    // Display plants using the following format:
    // <unique name> (<common name>)
    const newPlants: string[] = page.results.map((plant) => {
      const common_name_en =
        plant.common_name_en != null ? ' (' + plant.common_name_en[0] + ')' : '';

      return plant.unique_name + common_name_en;
    });
    
    // Loading the first page of a search query indicates, that the entire
    // results array has to be overwritten.
    // All other pages should just be appended.
    setPlants(pageNum == 1 ? newPlants : [...plants, ...newPlants]);
  }
  
  return (
    <div className="flex flex-col gap-4 p-2 h-full overflow-clip fixed">
      <div className="flex items-center justify-between">
        <h2>{t('plantSearch:dnd')}</h2>
        {!searchVisible && (
          <IconButton
            onClick={() => {
              setSearchVisible(true);
            }}
          >
            <SearchIcon />
          </IconButton>
        )}
      </div>
      <AnimatePresence>
        {searchVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 100,
              transition: { delay: 0, duration: 0.2 },
            }}
            exit={{
              opacity: 0,
              transition: { delay: 0, duration: 0.2 },
            }}
          >
            <SearchInput
              placeholder={t('plantSearch:placeholder')}
              handleSearch={async (event) => {
                setSearchTerm(event.target.value);
              }}
              ref={searchInputRef}
              onBlur={() => setSearchVisible(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchVisible(false);
              }}
            ></SearchInput>
            <ul onScroll={onSearchResultsScroll}
                ref={searchResultsRef}
                className="overflow-y-scroll h-full absolute"
            >
              {plants.map((plant) => (
                <li
                  className="flex items-center gap-4 stroke-neutral-700 hover:stroke-primary-500 hover:text-primary-500 dark:stroke-neutral-700-dark"
                  key={plant}
                >
                  <PlantIcon />
                  {plant}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
