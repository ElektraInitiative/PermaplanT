import { useDarkModeStore } from '@/features/dark_mode';
import { useTranslation } from 'react-i18next';

enum IconType {
  honors,
  visits,
}

interface CountingButtonProps {
  iconType: IconType;
  count: number;
}

export default function CountingButton({ iconType, count }: CountingButtonProps) {
  const { t } = useTranslation(['maps']);
  const darkMode = useDarkModeStore((state) => state.darkMode);
  let iconSrc = 'src/assets/';

  if (iconType === IconType.honors) {
    iconSrc += 'heart';
  } else if (iconType === IconType.visits) {
    iconSrc += 'person';
  }

  if (darkMode) {
    iconSrc += '_dark.svg';
  } else {
    iconSrc += '.svg';
  }

  return (
    <div
      className="m-1 flex h-2/3 rounded-xl bg-neutral-200 p-1 dark:bg-neutral-700"
      title={
        IconType[iconType] === 'honors'
          ? t('maps:overview.honors_title')
          : t('maps:overview.visits_title')
      }
    >
      <img
        src={iconSrc}
        className="mr-1 h-6 w-6"
        alt={
          IconType[iconType] === 'honors'
            ? t('maps:overview.honors_title')
            : t('maps:overview.visits_title')
        }
      />
      <span className="mr-1">{count}</span>
    </div>
  );
}
