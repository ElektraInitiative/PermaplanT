import PageLayout from '../../../components/Layout/PageLayout';
import CreateSeedForm from '../components/CreateSeedForm';
import { NewSeedDto } from '@/bindings/definitions';
import PageTitle from '@/components/Header/PageTitle';
import SimpleModal from '@/components/Modals/SimpleModal';
import { createSeed } from '@/features/seeds/api/createSeed';
import usePreventNavigation from '@/hooks/usePreventNavigation';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function CreateSeed() {
  const navigate = useNavigate();
  const { t } = useTranslation(['seeds', 'common']);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  const {
    mutate: submitSeed,
    isLoading: isUploadingSeed,
    isSuccess: isUploadingSuccess,
  } = useMutation(['create new seed'], createSeed, {
    onError: (error) => {
      const errorTyped = error as AxiosError;

      if (errorTyped.response?.status === 409) {
        toast(t('seeds:create_seed_form.error_seed_already_exists'));
        return;
      }

      toast(t('seeds:create_seed_form.error_create_seed'));
    },
    onSuccess: async () => {
      // Wait for the seed upload to be completed before navigating.
      // This ensures that all seeds are present on the overview page once the user sees it.
      await isUploadingSuccess;
      navigate('/seeds');
      toast.success(t('seeds:create_seed_form.success'));
    },
  });

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
    submitSeed(newSeed);
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
