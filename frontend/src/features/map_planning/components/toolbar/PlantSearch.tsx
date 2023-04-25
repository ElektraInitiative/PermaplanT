import IconButton from '@/components/Button/IconButton';
import SearchInput from '@/components/Form/SearchInput';
import { ReactComponent as PlantIcon } from '@/icons/plant.svg';
import { ReactComponent as SearchIcon } from '@/icons/search.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const allPlants = ['Strawberry', 'Cherry', 'Tomato', 'Potato', 'Onion'];

export const PlantSearch = () => {
  const [plants, setPlants] = useState(['Strawberry', 'Cherry', 'Tomato', 'Potato', 'Onion']);
  const [searchVisible, setSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, [searchVisible]);

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex items-center justify-between">
        <h2>Drag & drop plants</h2>
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
              placeholder="Search plants..."
              handleSearch={(event) => {
                const exp = new RegExp('.*' + event.target.value + '.*');
                setPlants(allPlants.filter((plant) => exp.test(plant)));
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
