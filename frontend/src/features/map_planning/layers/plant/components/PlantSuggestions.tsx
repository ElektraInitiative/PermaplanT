import { useSeasonalAvailablePlants } from '../hooks/useSeasonalAvailablePlants';
import { useSelectPlantForPlanting } from '../hooks/useSelectPlantForPlanting';
import { EmptyAvailablePlants } from './EmptyList/EmptyAvailablePlants';
import { PlantListItem } from './PlantListItem';
import { PlantSuggestionList } from './PlantSuggestionList';

export function PlantSuggestions() {
  const { plants, isLoading } = useSeasonalAvailablePlants(1, new Date());
  const { actions } = useSelectPlantForPlanting();

  return (
    <div className="flex flex-col gap-4 p-2">
      <PlantSuggestionList
        header={'Available Seeds'}
        hasContent={plants.length > 0}
        isLoading={isLoading}
        noContentElement={<EmptyAvailablePlants />}
      >
        {plants.map((plant) => (
          <PlantListItem
            key={plant.id}
            plant={plant}
            onClick={() => {
              actions.selectPlantForPlanting(plant);
            }}
          />
        ))}
      </PlantSuggestionList>
      {/* <PlantSuggestionList header={'Diversity'}>
        {plants.map((plant) => (
          <PlantListItem key={plant.id} plant={plant} onClick={onClick} />
        ))}
      </PlantSuggestionList>
      <PlantSuggestionList header={'Favorites'}>
        {plants.map((plant) => (
          <PlantListItem key={plant.id} plant={plant} onClick={onClick} />
        ))}
      </PlantSuggestionList>
      <PlantSuggestionList header={'Recently Used'}>
        {plants.map((plant) => (
          <PlantListItem key={plant.id} plant={plant} onClick={onClick} />
        ))}
      </PlantSuggestionList> */}
    </div>
  );
}
