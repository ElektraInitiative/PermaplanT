import CreateSeedForm from '../components/CreateSeedForm';
import { NewSeedDTO } from '@/bindings/definitions';
import PageTitle from '@/components/Header/PageTitle';
import SimpleModal from '@/components/Modals/SimpleModal';
import useCreateSeedStore from '../store/CreateSeedStore';
import { useState } from 'react';

export function CreateSeed() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const createSeed = useCreateSeedStore((state) => state.createSeed);
  const showErrorModal = useCreateSeedStore((state) => state.showErrorModal);
  const setShowErrorModal = useCreateSeedStore((state) => state.setShowErrorModal);
  const error = useCreateSeedStore((state) => state.error);

  const onCancel = () => {
    setShowCancelModal(!showCancelModal);
  };

  const onSubmit = async (newSeed: NewSeedDTO) => {
    await createSeed(newSeed);
  };

  return (
    <div className="mx-auto w-full p-4 md:w-[900px]">
      <PageTitle title="Neuer Eintrag" />
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
      <SimpleModal
        title="Fehler"
        body={`Ein Fehler ist aufgetreten: ${error}`}
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
