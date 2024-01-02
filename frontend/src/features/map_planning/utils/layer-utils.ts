import useMapStore from '../store/MapStore';
import { LayerType } from '@/api_types/definitions';

export function isPlantLayerActive(): boolean {
  const selectedLayerType = useMapStore.getState().getSelectedLayerType();
  return selectedLayerType === 'plants';
}

export function isBaseLayerActive(): boolean {
  const selectedLayerType = useMapStore.getState().getSelectedLayerType();
  return selectedLayerType === 'base';
}

export function isLayerOfTypeActive(layerType: LayerType): boolean {
  const selectedLayerType = useMapStore.getState().getSelectedLayerType();
  return selectedLayerType === layerType;
}
