import CreateSeedForm from '../components/CreateSeedForm';
import { NewSeed as NewSeedDTO } from '@/bindings/rust_ts_definitions';
import SimpleModal from '@/components/Modals/SimpleModal';
import { createSeed } from '../api/createSeed';
import { useState } from 'react';

export function CreateSeed() {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const onCancel = () => {
    setShowCancelModal(!showCancelModal);
  };

  const onSubmit = () => {
    const dto: NewSeedDTO = {
      name: 'from frontend',
      variety_id: 1,
      harvest_year: 2023,
      tags: ['Leaf crops'],
      quantity: 'Nothing',
    };
    createSeed(dto);
  };

  return (
    <div className="mx-auto w-full p-4 md:w-[700px]">
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
        onSubmit={onSubmit}
      />
    </div>
  );
}
