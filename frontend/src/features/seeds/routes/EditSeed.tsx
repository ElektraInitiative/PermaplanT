import CreateSeedForm from '../components/CreateSeedForm';
import { NewSeedDto } from '@/api_types/definitions';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import SimpleModal from '@/components/Modals/SimpleModal';
import {
  useEditSeed,
  useFindSeedById,
} from '@/features/map_planning/layers/plant/hooks/seedHookApi';
import { successToastGrouped } from '@/features/toasts/groupedToast';
import usePreventNavigation from '@/hooks/usePreventNavigation';
import { Suspense, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export function EditSeedPage() {
  const { id } = useParams();

  const seedId = id ? parseInt(id) : null;

  // Showing the page without an id would be a bug.
  if (!seedId) {
    return <Navigate to="/seeds" />;
  }

  return <EditSeed seedId={seedId} />;
}

type EditSeedProps = {
  seedId: number;
};

export function EditSeed({ seedId }: EditSeedProps) {
  const { t } = useTranslation(['seeds', 'common']);
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  const {
    data: seed,
    isLoading: seedIsLoading,
    isError: seedIsError,
  } = useFindSeedById({
    seedId: seedId,
  });

  const { mutate: updateSeed } = useEditSeed();

  const handleEditSeed = useCallback(
    (updatedSeed: NewSeedDto, seedId: number) => {
      updateSeed(
        { seed: updatedSeed, id: seedId },
        {
          onSuccess: () => {
            navigate('/seeds');
            successToastGrouped(t('seeds:edit_seed_form.success'));
          },
        },
      );
    },
    [navigate, t, updateSeed],
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
        {!seedIsLoading && (
          <CreateSeedForm
            isUploadingSeed={false}
            submitButtonTitle={t('seeds:edit_seed_form.btn_edit_seed')}
            existingSeed={!seedIsError ? seed : undefined}
            onCancel={onCancel}
            onChange={onChange}
            onSubmit={(newSeed) => handleEditSeed(newSeed, seedId)}
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
