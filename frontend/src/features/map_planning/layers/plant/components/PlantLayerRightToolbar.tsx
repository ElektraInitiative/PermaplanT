import { PlantSearch } from './PlantSearch';
import { PlantSuggestions } from './PlantSuggestions';

export function PlantLayerRightToolbar() {
  return (
    <div data-testid="plantsRightToolbar">
      <PlantSearch />
      <PlantSuggestions />
    </div>
  );
}
