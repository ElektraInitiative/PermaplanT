import { LayerDto, LayerType } from '@/api_types/definitions';
import useMapStore from '../store/MapStore';
import { CombinedLayerType } from '../store/MapStoreTypes';

export type SelectedLayerVisibility = {
  selectedLayerType: CombinedLayerType;
  isSelectedLayerVisible: boolean;
};

export function useSelectedLayerVisibility(): SelectedLayerVisibility {
  const getSelectedLayerType = useMapStore((map) => map.getSelectedLayerType);
  const selectedLayer = useMapStore((map) => map.untrackedState.selectedLayer) as LayerDto;

  const selectedLayerType = getSelectedLayerType();

  const untrackedLayers = useMapStore((map) => map.untrackedState.layers);

  console.log('state', untrackedLayers);

  if (selectedLayerType === LayerType.Drawing) {
    return {
      selectedLayerType,
      isSelectedLayerVisible: untrackedLayers.drawing.layerStates[selectedLayer.id].visible,
    };
  } else {
    return {
      selectedLayerType,
      isSelectedLayerVisible: untrackedLayers[selectedLayerType].visible,
    };
  }
}
