import { useDarkModeStore } from '@/features/dark_mode';

enum IconType {
  honors,
  visits,
}

interface CountingButtonProps {
  iconType: IconType;
  count: number;
}

export default function CountingButton({ iconType, count }: CountingButtonProps) {
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
      title={IconType[iconType]}
    >
      <img src={iconSrc} className="mr-1 h-6 w-6" alt={`Number of ${IconType[iconType]}`} />
      <span className="mr-1">{count}</span>
    </div>
  );
}
