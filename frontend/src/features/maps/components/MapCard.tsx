import CountingButton from './CountingButton';
import { MapDto } from '@/bindings/definitions';

interface MapCardProps {
  map: MapDto;
}

export default function MapCard({ map }: MapCardProps) {
  return (
    <div
      className="mb-4 flex rounded-lg bg-neutral-100 p-4 shadow-md dark:bg-neutral-800"
      title={map.name}
    >
      {/* A preview image of the map can be placed here later */}
      <div id="placeholderImage" />
      <section className="flex flex-col">
        <span className="text-lg font-medium text-primary-500 dark:text-primary-300">
          {map.name}
        </span>
        <span className="text-sm italic">{map.creation_date}</span>
      </section>
      <section className="ml-auto flex items-center">
        <CountingButton iconType={0} count={map.honors} />
        <CountingButton iconType={1} count={map.visits} />
      </section>
    </div>
  );
}
