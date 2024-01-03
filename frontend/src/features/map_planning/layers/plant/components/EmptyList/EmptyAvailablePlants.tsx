import { useTranslation } from 'react-i18next';
import ButtonLink from '@/components/Button/ButtonLink';

export function EmptyAvailablePlants() {
  const { t } = useTranslation(['plantingSuggestions']);

  return (
    <div className="flex flex-1 flex-col items-center p-4 pt-0">
      <span className="text-md mb-4 text-center font-medium">
        {t('plantingSuggestions:available_seeds.empty_list_title')}
      </span>
      <p className="mb-4 max-w-xs text-center text-[0.8rem] text-neutral-400">
        {t('plantingSuggestions:available_seeds.empty_list_message')}
      </p>
      <ButtonLink to="/seeds" title={t('plantingSuggestions:available_seeds.empty_list_action')} />
    </div>
  );
}
