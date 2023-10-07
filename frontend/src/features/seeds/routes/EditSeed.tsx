import { findSeedById } from '../api/findSeedById';
import CreateSeedForm from '../components/CreateSeedForm';
import { NewSeedDto } from '@/bindings/definitions';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import SimpleModal from '@/components/Modals/SimpleModal';
import { editSeed } from '@/features/seeds/api/editSeeds';
import usePreventNavigation from '@/hooks/usePreventNavigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export function EditSeed() {
  const { t } = useTranslation(['seeds', 'common']);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  const { mutate: submitNewSeed, isSuccess: isUploadingSuccess } = useMutation(
    ['edit Seed'],
    editSeed,
    {
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
        navigate(`/seeds/`);
        toast.success(t('seeds:edit_seed_form.success'));
      },
    },
  );

  const getSeed = () => findSeedById(parseInt(id ?? ''));

  const {
    data: seed,
    isLoading: seedIsLoading,
    isError: seedIsError,
  } = useQuery(['seed', id], getSeed, {
    cacheTime: 0,
    staleTime: 0,
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

  const onChange = () => {
    setFormTouched(true);
  };

  const onSubmit = async (newSeed: NewSeedDto) => {
    submitNewSeed({ seed: newSeed, id: parseInt(id ?? '0') });
  };

  return (
    <Suspense>
      <PageLayout>
        <PageTitle title={t('seeds:create_seed.title')} />
        {!seedIsLoading && (
          <CreateSeedForm
            isUploadingSeed={false}
            submitButtonTitle={t('seeds:edit_seed_form.btn_edit_seed')}
            existingSeed={!seedIsError ? seed : undefined}
            onCancel={onCancel}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        )}
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
    </Suspense>
  );
}
