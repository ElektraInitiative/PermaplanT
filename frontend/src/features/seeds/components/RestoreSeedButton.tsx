import { SeedDto } from '@/api_types/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import { useRestoreSeed } from '@/features/seeds/hooks/seedHookApi';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export function RestoreSeedButton({ seed }: { seed: SeedDto }) {
  const { t } = useTranslation(['seeds', 'common']);

  const { mutate: restoreSeed } = useRestoreSeed();

  const handleSeedRestore = useCallback(
    (seed: SeedDto) => {
      restoreSeed(seed, {
        onSuccess: (seed) => {
          toast.success(t('seeds:view_seeds.restore_seed_success', { seed: seed.name }));
        },
      });
    },
    [restoreSeed, t],
  );

  return (
    <div>
      {t('seeds:view_seeds.restore_seed_message', { seed: seed.name })}
      <SimpleButton onClick={() => handleSeedRestore(seed)}>
        {t('seeds:view_seeds.restore_seed_button')}
      </SimpleButton>
    </div>
  );
}
