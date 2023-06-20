import { useParams } from 'react-router-dom';

/**
 * Gets the map id from the URL path.
 * Will throw an error if there is no map id found on the path.
 */
export function useMapId() {
  const params = useParams();
  const mapId = params.mapId as string;

  return Number(mapId);
}
