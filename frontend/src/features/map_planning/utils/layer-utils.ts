import useMapStore from '../store/MapStore';

export function isPlantLayerActive(): boolean {
  const selectedLayerType = useMapStore.getState().getSelectedLayerType();
  return selectedLayerType === 'plants';
}

export function isBaseLayerActive(): boolean {
  const selectedLayerType = useMapStore.getState().getSelectedLayerType();
  return selectedLayerType === 'base';
}
