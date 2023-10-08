import { PlantAndSeedSearch } from './PlantAndSeedSearch';
import { PlantSuggestions } from './PlantSuggestions';

export function PlantLayerRightToolbar() {
  return (
    <>
      <PlantAndSeedSearch />
      <PlantSuggestions />
    </>
  );
}
