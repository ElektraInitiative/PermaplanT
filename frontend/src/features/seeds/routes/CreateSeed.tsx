import CreateSeedForm from '../components/CreateSeedForm';
import useCreateSeedStore from '../store/CreateSeedStore';
import { NewSeedDto } from '@/bindings/definitions';
import { SelectOption } from '@/components/Form/SelectMenu';
import PageTitle from '@/components/Header/PageTitle';
import SimpleModal from '@/components/Modals/SimpleModal';
import usePreventNavigation from '@/hooks/usePreventNavigation';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function useDebounce<T>(searchFunction: (searchParam: T) => void, delay: number) {
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout>>();

  const debouncedSearch = (searchParam: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const timeout = setTimeout(() => {
      searchFunction(searchParam);
    }, delay);

    setTimeoutId(timeout);
  };

  return [debouncedSearch];
}

function formatCommonName(commonName: string[] | undefined) {
  if (commonName == null) return '';

  return commonName[0] == null ? '' : '(' + commonName[0] + ')';
}

export function CreateSeed() {
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const createSeed = useCreateSeedStore((state) => state.createSeed);
  const searchPlants = useCreateSeedStore((state) => state.searchPlants);
  const showErrorModal = useCreateSeedStore((state) => state.showErrorModal);
  const setShowErrorModal = useCreateSeedStore((state) => state.setShowErrorModal);
  const error = useCreateSeedStore((state) => state.error);
  const [debouncedSearchPlants] = useDebounce(searchPlants, 350);

  const onCancel = () => {
    // There is no need to show the cancel warning modal if the user
    // has not made any changes yet.
    if (!formTouched) {
      navigate('/seeds');
      return;
    }

    setShowCancelModal(!showCancelModal);
  };

  useEffect(() => {
    // This is a small workaround so it's possible to use async/await in useEffect
    const _searchPlants = async () => {
      await searchPlants('');
    };

    _searchPlants();
  }, []);
  usePreventNavigation(formTouched);

  const onSubmit = async (newSeed: NewSeedDto) => {
    // we can not directly check for an error here because the data would be stale
    // and not reflect the current state of the store
    //
    // an alternative would be to get a reference to the store and get the error from there
    // const store = useCreateSeedStore.getState();
    // if (!store.error) {...}
    await createSeed(newSeed, () => navigate('/seeds'));
  };

  const onChange = () => {
    setFormTouched(true);
  };

  const onVarietyInputChange = (inputValue: string) => {
    debouncedSearchPlants(inputValue);
  };

  const plants: SelectOption[] = useCreateSeedStore((state) =>
    state.plants.map((plant) => {
      const commonName = formatCommonName(plant.common_name);
      return { value: plant.id, label: plant.binomial_name + ' ' + commonName };
    }),
  );

  return (
    <div className="mx-auto w-full p-4 md:w-[900px]">
      <PageTitle title="New Seed Entry" />
      <CreateSeedForm
        plants={plants}
        onCancel={onCancel}
        onChange={onChange}
        onSubmit={onSubmit}
        onVarietyInputChange={onVarietyInputChange}
      />
      <SimpleModal
        title="Cancel Changes?"
        body="Changes you have made will not be saved. Do you really want to cancel?"
        cancelBtnTitle="No"
        submitBtnTitle="Yes"
        show={showCancelModal}
        setShow={setShowCancelModal}
        onCancel={() => {
          setShowCancelModal(false);
        }}
        onSubmit={() => {
          navigate('/seeds');
        }}
      />
      <SimpleModal
        title="Error"
        body={error?.message || 'An unknown error occurred.'} // Error should always have a message
        show={showErrorModal}
        setShow={setShowErrorModal}
        submitBtnTitle="Ok"
        onSubmit={() => {
          setShowErrorModal(false);
        }}
      ></SimpleModal>
    </div>
  );
}
