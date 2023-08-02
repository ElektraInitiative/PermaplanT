import PageLayout from '../../../components/Layout/PageLayout';
import CreateSeedForm from '../components/CreateSeedForm';
import useCreateSeedStore from '../store/CreateSeedStore';
import { NewSeedDto } from '@/bindings/definitions';
import PageTitle from '@/components/Header/PageTitle';
import SimpleModal from '@/components/Modals/SimpleModal';
import usePreventNavigation from '@/hooks/usePreventNavigation';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function CreateSeed() {
  const navigate = useNavigate();
  const { t } = useTranslation(['seeds', 'common']);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const createSeed = useCreateSeedStore((state) => state.createSeed);
  const isUploadingSeed = useCreateSeedStore((state) => state.isUploadingSeed);

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

  const onSubmit = async (newSeed: NewSeedDto) => {
    // we can not directly check for an error here because the data would be stale
    // and not reflect the current state of the store
    //
    // an alternative would be to get a reference to the store and get the error from there
    // const store = useCreateSeedStore.getState();
    // if (!store.error) {...}
    await createSeed(newSeed, t('seeds:create_seed_form.error_create_seed'), () =>
      navigate('/seeds'),
    );
  };

  const onChange = () => {
    setFormTouched(true);
  };

  return (
    <Suspense>
      <PageLayout>
        <PageTitle title={t('seeds:create_seed.title')} />
        <CreateSeedForm
          submitButtonTitle={t('seeds:create_seed_form.btn_create_seed')}
          isUploadingSeed={isUploadingSeed}
          onCancel={onCancel}
          onChange={onChange}
          onSubmit={onSubmit}
        />
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
      </PageLayout>
    </Suspense>
  );
}
