import SearchInput from '@/components/Form/SearchInput';
import { useState } from 'react';
import { ReactComponent as PlantIcon } from '@/icons/plant.svg';

const allPlants = ['Strawberry', 'Cherry', 'Tomato', 'Potato', 'Onion'];

export const PlantSearch = () => {
  const [plants, setPlants] = useState(['Strawberry', 'Cherry', 'Tomato', 'Potato', 'Onion']);
  return (
    <div className="flex flex-col gap-4">
      <h2>Drag & drop plants</h2>
      <SearchInput
        placeholder="Search plants..."
        handleSearch={(event) => {
          const exp = new RegExp('.*' + event.target.value + '.*');
          setPlants(allPlants.filter((plant) => exp.test(plant)));
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
    </div>
  );
};
