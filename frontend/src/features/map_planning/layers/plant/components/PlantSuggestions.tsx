import { PlantListElement } from './PlantListElement';
import { PlantSuggestionList } from './PlantSuggestionList';
import { PlantsSummaryDto } from '@/bindings/definitions';

type Suggestions = {
  available: PlantsSummaryDto[];
  diversity: PlantsSummaryDto[];
  favorites: PlantsSummaryDto[];
  recent: PlantsSummaryDto[];
};

const MOCK_PLANTS: PlantsSummaryDto[] = [
  {
    id: 1,
    unique_name: 'Black Cherry (Tomato)',
    common_name_en: ['Black Cherry'],
  },
  {
    id: 2,
    unique_name: 'Habanero (Chili)',
    common_name_en: ['Habanero'],
  },
  {
    id: 3,
    unique_name: 'Flynn (Paprika)',
    common_name_en: ['Flynn'],
  },
  {
    id: 4,
    unique_name: 'San Marzano (Tomato)',
    common_name_en: ['San Marzano Tomato'],
  },
  {
    id: 5,
    unique_name: 'Sweet Chocolate (Pepper)',
    common_name_en: ['Sweet Chocolate Pepper'],
  },
];

const MOCK_SUGGESTIONS: Suggestions = {
  available: MOCK_PLANTS,
  diversity: MOCK_PLANTS,
  favorites: MOCK_PLANTS,
  recent: MOCK_PLANTS,
};

export function PlantSuggestions() {
  return (
    <div className="flex flex-col gap-4 p-2">
      <PlantSuggestionList header={'Available Seeds'}>
        {MOCK_SUGGESTIONS.available.map((plant) => (
          <PlantListElement key={plant.id} plant={plant} />
        ))}
      </PlantSuggestionList>
      <PlantSuggestionList header={'Diversity'}>
        {MOCK_SUGGESTIONS.diversity.map((plant) => (
          <PlantListElement key={plant.id} plant={plant} />
        ))}
      </PlantSuggestionList>
      <PlantSuggestionList header={'Favorites'}>
        {MOCK_SUGGESTIONS.favorites.map((plant) => (
          <PlantListElement key={plant.id} plant={plant} />
        ))}
      </PlantSuggestionList>
      <PlantSuggestionList header={'Recently Used'}>
        {MOCK_SUGGESTIONS.recent.map((plant) => (
          <PlantListElement key={plant.id} plant={plant} />
        ))}
      </PlantSuggestionList>
    </div>
  );
}
