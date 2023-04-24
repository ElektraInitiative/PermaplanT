import { editSeed } from '../api/editSeeds';
import { findSeedById } from '../api/findSeedById';
import CreateSeedForm from '../components/CreateSeedForm';
import useCreateSeedStore from '../store/CreateSeedStore';
import { NewSeedDto, SeedDto } from '@/bindings/definitions';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import SimpleModal from '@/components/Modals/SimpleModal';
import usePreventNavigation from '@/hooks/usePreventNavigation';
import { t } from 'i18next';
import { Suspense, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function EditSeed() {
  const { id } = useParams();
  const [seed, setSeed] = useState<SeedDto | null>(null);
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
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

  usePreventNavigation(formTouched);

  const onChange = () => {
    setFormTouched(true);
  };

  useEffect(() => {
    const _findOneSeed = async () => {
      try {
        const seed = await findSeedById(Number(id));
        setSeed(seed);
      } catch (error) {}
    };
    _findOneSeed();
  }, [id]);

  const onSubmit = async (newSeed: NewSeedDto) => {
    try {
      await editSeed(newSeed, Number(id));
      navigate(`/seeds/${id}`);
    } catch (error) {}
  };

  return (
    <Suspense>
      <PageLayout>
        <PageTitle title={t('seeds:create_seed.title')} />
        <CreateSeedForm
          isUploadingSeed={false}
          existingSeed={seed ? seed : undefined}
          onCancel={onCancel}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </PageLayout>
      <SimpleModal
        title={t('seeds:create_seed.changes_model_title')}
        body={t('seeds:create_seed.changes_model_message')}
        cancelBtnTitle={t('common:no')}
        submitBtnTitle={t('common:yes')}
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
        title={t('seeds:error_modal_title')}
        body={error?.message || t('common:unknown_error')} // Error should always have a message
        show={showErrorModal}
        setShow={setShowErrorModal}
        submitBtnTitle={t('common:ok')}
        onSubmit={() => {
          setShowErrorModal(false);
        }}
      ></SimpleModal>
    </Suspense>
  );
}
