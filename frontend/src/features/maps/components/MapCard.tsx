import { MapDto } from '@/bindings/definitions';

interface MapCardProps {
  map: MapDto;
}

export default function MapCard({ map }: MapCardProps) {
  return (
    <div>
      <div id="placeholderImage" />
      <section>
        <span>{map.name}</span>
        <span>{map.creation_date}</span>
      </section>
      <section>
        <CountingButton count={map.honors} />
        <CountingButton count={map.visits} />
      </section>
    </div>
  );
}

interface CountingButtonProps {
  icon?: string;
  count: number;
}

function CountingButton({ icon, count }: CountingButtonProps) {
  return (
    <div>
      <div>{icon}</div>
      <div>{count}</div>
    </div>
  );
}
