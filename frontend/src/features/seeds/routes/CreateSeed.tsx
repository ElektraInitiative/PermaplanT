import CreateSeedForm from '../components/CreateSeedForm';
import { NewSeedDTO } from '@/bindings/definitions';
import SimpleModal from '@/components/Modals/SimpleModal';
import { createSeed } from '../api/createSeed';
import useCreateSeedLoadingStore from '../store/CreateSeedStore';
import { useState } from 'react';

export function CreateSeed() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const loadingStore = useCreateSeedLoadingStore();

  const onCancel = () => {
    setShowCancelModal(!showCancelModal);
  };

  const onSubmit = (newSeedDTO: NewSeedDTO) => {
    const onSuccess = () => {
      console.log('Seed creation succeded');
      loadingStore.updateIsUploadingSeed(false);
    };
    const onError = (error: Error) => {
      console.log(error);
      loadingStore.updateIsUploadingSeed(false);
    };
    createSeed(newSeedDTO, onSuccess, onError);
  };

  return (
    <div className="mx-auto w-full p-4 md:w-[900px]">
      <h2 className="mb-8">Neuer Eintrag</h2>
      <CreateSeedForm onCancel={onCancel} onSubmit={onSubmit} />
      <SimpleModal
        title="Eintrag abbrechen"
        body="Änderungen, die Sie vorgenommen haben, werden nicht gespeichert. Wollen Sie wirklich abbrechen?"
        cancelBtnTitle="Nein"
        submitBtnTitle="Ja"
        show={showCancelModal}
        setShow={setShowCancelModal}
        onCancel={() => {
          setShowCancelModal(false);
        }}
        onSubmit={() => {
          // TODO: redirect to previous page or another page
        }}
      />
    </div>
  );
}
