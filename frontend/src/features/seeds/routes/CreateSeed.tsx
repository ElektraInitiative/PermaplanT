import PageLayout from '../../../components/Layout/PageLayout';
import CreateSeedForm from '../components/CreateSeedForm';
import { NewSeedDto } from '@/api_types/definitions';
import PageTitle from '@/components/Header/PageTitle';
import SimpleModal from '@/components/Modals/SimpleModal';
import { useCreateSeed } from '@/features/seeds/hooks/seedHookApi';
import { successToastGrouped } from '@/features/toasts/groupedToast';
import usePreventNavigation from '@/hooks/usePreventNavigation';
import { Suspense, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function CreateSeed() {
  const navigate = useNavigate();
  const { t } = useTranslation(['seeds', 'common']);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const { mutate: submitSeed, isLoading: isUploadingSeed } = useCreateSeed();

  const handleCreateSeed = useCallback(
    (newSeed: NewSeedDto) => {
      submitSeed(newSeed, {
        onSuccess: () => {
          navigate('/seeds');
          successToastGrouped(t('seeds:create_seed_form.success'));
        },
      });
    },
    [navigate, submitSeed, t],
  );

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

  return (
    <Suspense>
      <PageLayout>
        <PageTitle title={t('seeds:create_seed.title')} />
        <CreateSeedForm
          submitButtonTitle={t('seeds:create_seed_form.btn_create_seed')}
          isUploadingSeed={isUploadingSeed}
          onCancel={onCancel}
          onChange={onChange}
          onSubmit={handleCreateSeed}
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
