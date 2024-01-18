import { FrontendOnlyLayerType } from '../layers/_frontend_only';
import useMapStore from '../store/MapStore';
import { CombinedLayerType } from '../store/MapStoreTypes';

export function useSelectedLayerType(): CombinedLayerType {
  const selectedLayer = useMapStore((state) => state.untrackedState.selectedLayer);

  if (typeof selectedLayer === 'object' && 'type_' in selectedLayer) {
    return selectedLayer.type_;
  }

  return selectedLayer as FrontendOnlyLayerType;
}

export function useIsPlantLayerActive(): boolean {
  const selectedLayerType = useSelectedLayerType();
  return selectedLayerType === 'plants';
}

export function useIsBaseLayerActive(): boolean {
  const selectedLayerType = useSelectedLayerType();
  return selectedLayerType === 'base';
}
