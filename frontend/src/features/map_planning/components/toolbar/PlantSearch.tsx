import IconButton from '@/components/Button/IconButton';
import SearchInput from '@/components/Form/SearchInput';
import { ReactComponent as PlantIcon } from '@/icons/plant.svg';
import { ReactComponent as SearchIcon } from '@/icons/search.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** plants list mock */
/** TODO: fetch plant data from backend */
const allPlants = [
  'Aloe vera',
  'Bamboo',
  'Cactus',
  'Daisy',
  'Eucalyptus',
  'Fern',
  'Gardenia',
  'Hibiscus',
  'Iris',
  'Jasmine',
  'Kangaroo paw',
  'Lavender',
  'Mimosa',
  'Narcissus',
  'Orchid',
  'Peony',
  'Quince',
  'Rose',
  'Sunflower',
  'Tulip',
  'Umbrella plant',
  'Violet',
  'Wisteria',
  'Xeranthemum',
  'Yarrow',
  'Zinnia',
  'Amaryllis',
  'Begonia',
  'Chrysanthemum',
  'Dahlia',
  'Echinacea',
  'Fuchsia',
  'Geranium',
  'Hollyhock',
  'Impatiens',
  'Jade plant',
  'Kalanchoe',
  'Lilac',
  'Morning glory',
  'Nasturtium',
  'Oleander',
  'Pansy',
  "Queen Anne's lace",
  'Ranunculus',
  'Snapdragon',
  'Tiger lily',
  'Uva ursi',
  'Verbena',
  'Wax begonia',
  'Xanthe',
  'Yellowwood',
  'Zantedeschia',
  'Anemone',
  'Bittersweet',
  'Carnation',
  'Daffodil',
  'English ivy',
  'Forsythia',
  'Gloxinia',
  'Honeysuckle',
  'Ivy geranium',
  'Jonquil',
  'Kerria',
  'Lantana',
  'Marigold',
  'Nigella',
  'Oxalis',
  'Petunia',
  'Rhubarb',
  'Sedum',
  'Thyme',
  'Upright juniper',
  'Vinca',
  'Wild rose',
  'Xerophyllum',
  'Yucca',
  'Zephyranthes',
  'Angelonia',
  'Bacopa',
  'Clematis',
  'Dianthus',
  'Eryngium',
  'Forget-me-not',
  'Goldenrod',
  'Heather',
  'Iris germanica',
  'Jovellana',
  'Kaffir lily',
  'Lily of the valley',
  'Monkshood',
  'Nemesia',
  'Oregano',
  'Primrose',
  'Ranunculus asiaticus',
  'Salvia',
  'Thistle',
  'Umbrella tree',
  'Verbascum',
  'Winter jasmine',
  'Xylosma',
  'Yerba buena',
  'Zelkova',
];

/** UI component intended for searching plants that can be drag and dropped to the plant layer */
export const PlantSearch = () => {
  const [plants, setPlants] = useState(allPlants);
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
