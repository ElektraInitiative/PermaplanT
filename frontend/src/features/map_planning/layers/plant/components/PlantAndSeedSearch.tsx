import { useIsReadOnlyMode } from '../../../utils/ReadOnlyModeContext';
import { usePlantSearch } from '../hooks/plantHookApi';
import { useSelectPlantForPlanting } from '../hooks/useSelectPlantForPlanting';
import { PlantListItem } from './PlantListItem';
import { PlantsSummaryDto, SeedDto } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import SearchInput, { SearchInputHandle } from '@/components/Form/SearchInput';
import { SeedListItem } from '@/features/map_planning/layers/plant/components/SeedListItem';
import { useSeedSearch } from '@/features/map_planning/layers/plant/hooks/seedHookApi';
import useMapStore from '@/features/map_planning/store/MapStore';
import { PlantForPlanting } from '@/features/map_planning/store/MapStoreTypes';
import { resetSelection } from '@/features/map_planning/utils/ShapesSelection';
import CloseIcon from '@/svg/icons/close.svg?react';
import SearchIcon from '@/svg/icons/search.svg?react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** UI component intended for searching plants that can planted on the plants layer */
export const PlantAndSeedSearch = () => {
  const { t } = useTranslation(['plantSearch', 'plantAndSeedSearch']);

  const {
    queryInfo: { data: plants },
    actions: plantSearchActions,
  } = usePlantSearch();

  const {
    queryInfo: { data },
    actions: seedSearchActions,
  } = useSeedSearch();
  const { actions } = useSelectPlantForPlanting();

  const seeds = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data]);

  const isReadOnlyMode = useIsReadOnlyMode();

  const [searchVisible, setSearchVisible] = useState(false);
  const searchInputRef = useRef<SearchInputHandle>(null);

  const clearSearch = () => {
    plantSearchActions.clearSearchTerm();
    seedSearchActions.clearSearchTerm();
    setSearchVisible(false);
  };

  const transformerRef = useMapStore((state) => state.transformer);

  const selectPlantForPlanting = (plant: PlantForPlanting) => {
    actions.selectPlantForPlanting(plant);
    resetSelection(transformerRef);
  };

  const handleClickOnPlantListItem = useCallback(selectPlantForPlanting, [actions, transformerRef]);
  const handleClickOnSeedListItem = (seed: SeedDto, plant: PlantsSummaryDto) =>
    selectPlantForPlanting({ plant, seed });

  useEffect(() => {
    searchInputRef.current?.focusSearchInputField();
  }, [searchVisible]);

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex items-center justify-between">
        <h2>{t('plantSearch:planting')}</h2>
        {searchVisible ? (
          <IconButton onClick={clearSearch} data-testid="plant-search__close-icon">
            <CloseIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => {
              setSearchVisible(true);
            }}
            data-tourid="search_button"
            data-testid="plant-search__icon-button"
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
              disabled={isReadOnlyMode}
              placeholder={t('plantSearch:placeholder')}
              handleSearch={(event) => {
                plantSearchActions.searchPlants(event.target.value);
                seedSearchActions.searchSeeds(event.target.value);
              }}
              ref={searchInputRef}
              data-testid="plant-search__search-input"
            ></SearchInput>
            <h2 className="mb-2 mt-3" hidden={seeds.length === 0}>
              {t('plantAndSeedSearch:seed_section_title')}
            </h2>
            <ul data-tourid="seed_list" hidden={seeds.length === 0}>
              {seeds.map((seed) => (
                <SeedListItem
                  disabled={isReadOnlyMode}
                  seed={seed}
                  key={seed.id}
                  onClick={handleClickOnSeedListItem}
                />
              ))}
            </ul>
            <hr className="my-5" hidden={seeds.length === 0} />
            <h2 className="mb-2 mt-3">{t('plantAndSeedSearch:plant_section_title')}</h2>
            <ul data-tourid="plant_list">
              {plants?.map((plant) => (
                <PlantListItem
                  disabled={isReadOnlyMode}
                  plant={plant}
                  key={plant.id}
                  onClick={() => {
                    handleClickOnPlantListItem({ plant, seed: null });
                  }}
                />
              ))}
            </ul>
            {plants?.length === 0 && (
              <div className="m-4" data-testid="plant-search__empty-results">
                {t('plantSearch:search_empty')}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
