import { PlantSearch } from './PlantSearch';
import { PlantSuggestions } from './PlantSuggestions';
import useMapStore from '@/features/map_planning/store/MapStore';

export function PlantLayerRightToolbar() {
  const selectPlantForPlanting = useMapStore((state) => state.selectPlantForPlanting);

  return (
    <>
      <PlantSearch />
      <PlantSuggestions onPlantListItemClick={(plant) => selectPlantForPlanting(plant)} />
    </>
  );
}
