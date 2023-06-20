import { useGetLayers } from './useGetLayers';
import { LayerType } from '@/bindings/definitions';

export function useDefaultLayer(mapId: string, layerType: LayerType) {
  const layerData = useGetLayers(mapId);

  const defaultLayer = layerData.data?.find((l) => l.type_ === layerType && !l.is_alternative);

  return defaultLayer;
}
