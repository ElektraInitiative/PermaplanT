import IconButton from '@/components/Button/IconButton';
import SearchInput from '@/components/Form/SearchInput';
import { baseApiUrl } from '@/config/env';
import { ReactComponent as PlantIcon } from '@/icons/plant.svg';
import { ReactComponent as SearchIcon } from '@/icons/search.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** UI component intended for searching plants that can be drag and dropped to the plant layer */
export const PlantSearch = () => {
  const [plants, setPlants] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation(['plantSearch']);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, [searchVisible]);

  return (
    <div className="flex flex-col gap-4 p-2">
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
            initial={{ opacity: 0, translateY: '-20%' }}
            animate={{
              opacity: 100,
              translateY: 0,
              transition: { delay: 0, duration: 0.2 },
            }}
            exit={{
              opacity: 0,
              translateY: '-20%',
              transition: { delay: 0, duration: 0.2 },
            }}
          >
            <SearchInput
              placeholder={t('plantSearch:placeholder')}
              handleSearch={async (event) => {
                // TODO: debounce + other refactor
                const response = await fetch(
                  baseApiUrl + '/api/plants/search?search_query=' + event.target.value,
                );
                const json = await response.json();
                setPlants(json.results.map((plant: { unique_name: string }) => plant.unique_name));
              }}
              ref={searchInputRef}
              onBlur={() => setSearchVisible(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchVisible(false);
              }}
            ></SearchInput>
            <ul>
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
