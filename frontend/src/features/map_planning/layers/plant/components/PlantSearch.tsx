import { PlantListElement } from './PlantListElement';
import { PlantsSummaryDto } from '@/bindings/definitions';
import IconButton from '@/components/Button/IconButton';
import SearchInput from '@/components/Form/SearchInput';
import { searchPlants } from '@/features/seeds/api/searchPlants';
import { ReactComponent as SearchIcon } from '@/icons/search.svg';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** UI component intended for searching plants that can be drag and dropped to the plants layer */
export const PlantSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // used to prevent the search result from flickering
  const [plants, setPlants] = useState<PlantsSummaryDto[]>([]);

  const { data } = useQuery(['plants/search', searchTerm] as const, {
    queryFn: ({ queryKey: [, search] }) => searchPlants(search, 0),
    // prevent the query from being fetched again for the
    // same search term. plants are not expected to change
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data?.results) {
      setPlants(data.results);
    }
  }, [data]);

  const [searchVisible, setSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation(['plantSearch']);

  const clearSearch = () => {
    setSearchTerm('');
    setSearchVisible(false);
  };

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
              handleSearch={(event) => setSearchTerm(event.target.value)}
              ref={searchInputRef}
              onBlur={clearSearch}
              onKeyDown={(e) => {
                if (e.key === 'Escape') clearSearch();
              }}
            ></SearchInput>
            <ul>
              {plants.map((plant) => (
                <PlantListElement plant={plant} key={plant.unique_name} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
