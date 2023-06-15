import { useSeasonalAvailablePlants } from '../hooks/useSeasonalAvailablePlants';
import { useSelectPlantForPlanting } from '../hooks/useSelectPlantForPlanting';
import { PlantListItem } from './PlantListItem';
import { PlantSuggestionList } from './PlantSuggestionList';

export function PlantSuggestions() {
  const { plants } = useSeasonalAvailablePlants(1, new Date());
  const { actions } = useSelectPlantForPlanting();

  return (
    <div className="flex flex-col gap-4 p-2">
      <PlantSuggestionList
        header={'Available Seeds'}
        hasContent={plants.length > 0}
        noContentElement="No plants available for this season."
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
