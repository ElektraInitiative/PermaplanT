import useMapStore from '../store/MapStore';
import { LayerType } from '@/api_types/definitions';

export function isPlantLayerActive(): boolean {
  const selectedLayerType = useMapStore.getState().getSelectedLayerType();
  return selectedLayerType === LayerType.Plants;
}

export function isBaseLayerActive(): boolean {
  const selectedLayerType = useMapStore.getState().getSelectedLayerType();
  return selectedLayerType === LayerType.Base;
}

export function isDrawingLayerActive(): boolean {
  const selectedLayerType = useMapStore.getState().getSelectedLayerType();
  return selectedLayerType === LayerType.Drawing;
}
