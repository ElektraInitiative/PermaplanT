import { useParams } from 'react-router-dom';

export function useMapId() {
  const params = useParams();
  const mapId = params.mapId as string;

  return Number(mapId);
}
