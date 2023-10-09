import { useIsReadOnlyMode } from '../../../utils/ReadOnlyModeContext';
import { useSeasonallyAvailablePlants } from '../hooks/useSeasonalAvailablePlants';
import { useSelectPlantForPlanting } from '../hooks/useSelectPlantForPlanting';
import { EmptyAvailablePlants } from './EmptyList/EmptyAvailablePlants';
import { PlantListItem } from './PlantListItem';
import { PlantsSummaryDto } from '@/bindings/definitions';
import IconButton from '@/components/Button/IconButton';
import SearchInput, { SearchInputHandle } from '@/components/Form/SearchInput';
import useMapStore from '@/features/map_planning/store/MapStore';
import { resetSelection } from '@/features/map_planning/utils/ShapesSelection';
import { ReactComponent as CloseIcon } from '@/icons/close.svg';
import { ReactComponent as SearchIcon } from '@/icons/search.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function PlantSuggestions() {
  const { t } = useTranslation(['plantingSuggestions']);
  const isReadOnlyMode = useIsReadOnlyMode();

  const { hasAnyAvailablePlantSeeds, filteredPlantSeeds, searchActions } =
    useSeasonallyAvailablePlants(1, new Date());

  const { actions } = useSelectPlantForPlanting();
  const transformerRef = useMapStore((state) => state.transformer);

  const [searchVisible, setSearchVisible] = useState(false);
  const searchInputRef = useRef<SearchInputHandle>(null);

  const renderSearchList = searchVisible && hasAnyAvailablePlantSeeds;
  const renderEmptySearchList = searchVisible && !hasAnyAvailablePlantSeeds;

  const handleClickOnPlantListItem = useCallback(
    (plant: PlantsSummaryDto) => {
      const storeChosenPlantInUntrackedStore = () => actions.selectPlantForPlanting(plant);

      storeChosenPlantInUntrackedStore();
      resetSelection(transformerRef);
    },
    [actions, transformerRef],
  );

  const clearSearch = () => {
    searchActions.clearSearchTerm();
    setSearchVisible(false);
  };

  useEffect(() => {
    searchInputRef.current?.focusSearchInputField();
  }, [searchVisible]);

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex items-center justify-between">
        <h2>{t('plantingSuggestions:available_seeds.list_title')}</h2>
        {searchVisible ? renderSearchClosingIcon(clearSearch) : renderSearchIcon(setSearchVisible)}
      </div>
      <AnimatePresence>
        {renderSearchList && (
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
              placeholder={t('plantingSuggestions:available_seeds.placeholder')}
              handleSearch={(event) => searchActions.searchAvailablePlantSeeds(event.target.value)}
              ref={searchInputRef}
              data-testid="plant-seeds-search-input"
            />

            <ul>
              {filteredPlantSeeds.map((plantSeed) => (
                <PlantListItem
                  disabled={isReadOnlyMode}
                  plant={plantSeed}
                  key={plantSeed.id + Math.random()} // temporary hack until real seed identity is implemented
                  onClick={() => {
                    handleClickOnPlantListItem(plantSeed);
                  }}
                />
              ))}
            </ul>

            {filteredPlantSeeds.length === 0 && (
              <div className="m-4" data-testid="plant-seeds-search-results-empty">
                {t('plantingSuggestions:available_seeds.search_empty')}
              </div>
            )}
          </motion.div>
        )}

        {renderEmptySearchList && <EmptyAvailablePlants />}
      </AnimatePresence>
    </div>
  );
}

function renderSearchIcon(setSearchVisible: Dispatch<SetStateAction<boolean>>) {
  return (
    <IconButton
      onClick={() => {
        setSearchVisible(true);
      }}
      data-testid="plant-seeds-search-icon"
    >
      <SearchIcon />
    </IconButton>
  );
}

function renderSearchClosingIcon(clearSearch: () => void) {
  return (
    <IconButton onClick={clearSearch} data-testid="plant-seeds-search-close-icon">
      <CloseIcon />
    </IconButton>
  );
}
