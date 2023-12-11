import { FrontendOnlyLayerType } from '../layers/_frontend_only';
import useMapStore from '../store/MapStore';
import { CombinedLayerType } from '../store/MapStoreTypes';
import { LayerType } from '@/api_types/definitions';

export function useSelectedLayerType(): CombinedLayerType {
  const selectedLayer = useMapStore((state) => state.untrackedState.selectedLayer);

  if (typeof selectedLayer === 'object' && 'type_' in selectedLayer) {
    return selectedLayer.type_;
  }

  return selectedLayer as FrontendOnlyLayerType;
}

export function useIsPlantLayerActive(): boolean {
  const selectedLayerType = useSelectedLayerType();
  return selectedLayerType === LayerType.Plants;
}

export function useIsBaseLayerActive(): boolean {
  const selectedLayerType = useSelectedLayerType();
  return selectedLayerType === LayerType.Base;
}

export function isDrawingLayerActive(): boolean {
  const selectedLayerType = useMapStore.getState().getSelectedLayerType();
  return selectedLayerType === LayerType.Drawing;
}
