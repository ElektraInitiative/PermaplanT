import { MapDto } from '@/bindings/definitions';
import { useDarkModeStore } from '@/features/dark_mode';

interface MapCardProps {
  map: MapDto;
}

export default function MapCard({ map }: MapCardProps) {
  return (
    <div className="flex rounded-lg bg-neutral-100 p-4 shadow-md dark:bg-neutral-800">
      {/* A preview image of the map can be placed here later */}
      <div id="placeholderImage" />
      <section className="flex flex-col">
        <span className="text-lg font-medium text-primary-500 dark:text-primary-300">
          {map.name}
        </span>
        <span className="text-sm italic">{map.creation_date}</span>
      </section>
      <section className="ml-auto flex items-center">
        <CountingButton iconType={IconType.honors} count={map.honors} />
        <CountingButton iconType={IconType.visits} count={map.visits} />
      </section>
    </div>
  );
}

enum IconType {
  honors,
  visits,
}

interface CountingButtonProps {
  iconType: IconType;
  count: number;
}

function CountingButton({ iconType, count }: CountingButtonProps) {
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
