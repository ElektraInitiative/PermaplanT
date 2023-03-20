import { useEffect, useState } from 'react';

import SimpleButton from '@/components/Button/SimpleButton';
import SearchInput from '@/components/Form/SearchInput';
import PageTitle from '@/components/Header/PageTitle';
import { useNavigate } from 'react-router-dom';
import { SeedDto } from '../../../bindings/definitions';
import PageLayout from '../../../components/Layout/PageLayout';
import SeedsOverviewList from '../components/SeedsOverviewList';
import useFindSeedsStore from '../store/FindSeedsStore';

export const ViewSeeds = () => {
  const navigate = useNavigate();

  const seeds = useFindSeedsStore((state) => state.seeds);

  useEffect(() => {
    const _findAllSeeds = async () => {
      await useFindSeedsStore.getState().findAllSeeds();
      setFilteredSeeds(useFindSeedsStore.getState().seeds);
    };
    _findAllSeeds();
  }, []);

    // Set the filter when the user types in the search input
    const [filteredSeeds, setFilteredSeeds] = useState<SeedDto[]>([]);

  const handleCreateSeedClick = () => {
    navigate('/seeds/new');
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    const temp = seeds.filter(
      (seed) =>
        seed.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        seed.harvest_year.toString().toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredSeeds(temp)
  };

  return (
    <PageLayout styleNames="flex flex-col space-y-4">
      <PageTitle title="My Seeds" />
      <div className="flex flex-row justify-between space-x-6">
        <SearchInput handleSearch={handleSearch} />
        <SimpleButton title="Neuer Eintrag" onClick={handleCreateSeedClick} />
      </div>
      <SeedsOverviewList seeds={filteredSeeds} />
    </PageLayout>
  );
};
