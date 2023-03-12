import CreateSeedForm from '../components/CreateSeedForm';
import { NewSeedDto } from '@/bindings/definitions';
import PageTitle from '@/components/Header/PageTitle';
import SimpleModal from '@/components/Modals/SimpleModal';
import useCreateSeedStore from '../store/CreateSeedStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function CreateSeed() {
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const createSeed = useCreateSeedStore((state) => state.createSeed);
  const showErrorModal = useCreateSeedStore((state) => state.showErrorModal);
  const setShowErrorModal = useCreateSeedStore((state) => state.setShowErrorModal);
  const error = useCreateSeedStore((state) => state.error);

  const onCancel = () => {
    // There is no need to show the cancel warning modal if the user
    // has not made any changes yet.
    if (!formTouched) {
      navigate('/seeds');
      return;
    }
      
    setShowCancelModal(!showCancelModal);
  };

  const onSubmit = async (newSeed: NewSeedDto) => {
    await createSeed(newSeed);
    if (error === null) {
      navigate('/seeds');
    }
  };

  const onChange = () => {
    setFormTouched(true);
  }

  return (
    <div className="mx-auto w-full p-4 md:w-[900px]">
      <PageTitle title="Neuer Eintrag" />
      <CreateSeedForm onCancel={onCancel} onChange={onChange} onSubmit={onSubmit} />
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
          navigate('/seeds');
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
