import useMapStore from '../store/MapStore';
import { CombinedLayerType } from '../store/MapStoreTypes';

export type SelectedLayerVisibility = {
  selectedLayerType: CombinedLayerType;
  isSelectedLayerVisible: boolean;
};

export function useSelectedLayerVisibility(): SelectedLayerVisibility {
  const getSelectedLayerType = useMapStore((map) => map.getSelectedLayerType);

  const selectedLayerType = getSelectedLayerType();
  const isSelectedLayerVisible = useMapStore(
    (map) => map.untrackedState.layers[selectedLayerType].visible,
  );

  return {
    selectedLayerType,
    isSelectedLayerVisible,
  };
}
