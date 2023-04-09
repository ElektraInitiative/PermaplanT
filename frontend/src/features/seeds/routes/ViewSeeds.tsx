import { findAllSeeds } from '../api/findAllSeeds';
import SeedsOverviewList from '../components/SeedsOverviewList';
import { SeedDto } from '@/bindings/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import SearchInput from '@/components/Form/SearchInput';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import SimpleModal from '@/components/Modals/SimpleModal';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const ViewSeeds = () => {
  const navigate = useNavigate();

  // load seeds namespace for the translation
  const { t } = useTranslation(['seeds', 'common']);

  const [seeds, setSeeds] = useState<SeedDto[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const _findAllSeeds = async () => {
      try {
        const seeds = await findAllSeeds();
        setSeeds(seeds);
        setFilteredSeeds(seeds);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
          setShowErrorModal(true);
        }
      }
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
        seed.harvest_year.toString().toLowerCase().includes(searchValue.toLowerCase()),
    );
    setFilteredSeeds(temp);
  };

  return (
    <Suspense>
      <PageLayout styleNames="flex flex-col space-y-4">
        <PageTitle title={t('seeds:view_seeds.title')} />
        <div className="flex flex-row justify-between space-x-6">
          <SearchInput
            placeholder={t('seeds:view_seeds.search_placeholder')}
            handleSearch={handleSearch}
          />
          <SimpleButton onClick={handleCreateSeedClick}>
            {t('seeds:view_seeds.btn_new_entry')}
          </SimpleButton>
        </div>
        <SeedsOverviewList seeds={filteredSeeds} />
        <SimpleModal
          title={t('seeds:error_modal_title')}
          body={error?.message || t('common:unknown_error')} // Error should always have a message
          show={showErrorModal}
          setShow={setShowErrorModal}
          submitBtnTitle={t('common:ok')}
          onSubmit={() => {
            setShowErrorModal(false);
          }}
        ></SimpleModal>
      </PageLayout>
    </Suspense>
  );
};
