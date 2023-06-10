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
  const [plants, setPlants] = useState<string[]>([]);
  const [searchTerm, setSearchTerm]   = useState('');
  const [nextPage, setNextPage]       = useState(1);

  const [searchScrollPos, setSearchScrollPos]   = useState(1);
  const [searchVisible, setSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation(['plantSearch']);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, [searchVisible]);
  

  useEffect(() => {
    // debounce plant search
    const loadInitalPage = setTimeout(() => {
      loadPage(1);
      setNextPage(2);
    }, 300);

    return () => clearTimeout(loadInitalPage);
  }, [searchTerm]);

  useEffect(() => {
    if (searchScrollPos > 0.1)
      return;

    // debounce page update
    const loadInitalPage = setTimeout(() => {
      loadPage(nextPage + 1);
    }, 300);

    return () => {
      clearTimeout(loadInitalPage);
      setNextPage(nextPage + 1);
    };
  }, [searchScrollPos]);
  
  const searchResultsRef = useRef<HTMLUListElement>(null);
  const onSearchResultsScroll = () => {
    const height = searchResultsRef.current?.getBoundingClientRect().height;
    const scrollOffset = searchResultsRef.current?.scrollTop;
    
    if (height === undefined || scrollOffset === undefined) {
      throw new Error('Undefined search result list properties.'); 
    }

    const scrollPosition = (height - scrollOffset) / height;
    setSearchScrollPos(scrollPosition);   
  };
  
  const loadPage = async (pageNum: number) => {
    console.log(plants);
    const page = await searchPlants(searchTerm, nextPage);
    
    if (nextPage > page.total_pages) {
        return;
    }

    const newPlants: string[] = page.results.map((plant) => {
      const common_name_en =
        plant.common_name_en != null ? ' (' + plant.common_name_en[0] + ')' : '';

      return plant.unique_name + common_name_en;
    });
  
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
