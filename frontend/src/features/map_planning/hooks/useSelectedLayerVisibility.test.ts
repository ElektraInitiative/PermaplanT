import { renderHook } from '@testing-library/react';
import { LayerDto, LayerType } from '@/api_types/definitions';
import useMapStore from '../store/MapStore';
import { UNTRACKED_DEFAULT_STATE, UntrackedMapSlice } from '../store/MapStoreTypes';
import { useSelectedLayerVisibility } from './useSelectedLayerVisibility';

describe('useSelectedLayerVisibility', () => {
  test('should return base layer as selected and visible', () => {
    setupSelectedLayerWithVisibility(LayerType.Base, true);

    const { result } = renderHook(useSelectedLayerVisibility);

    expect(result.current.selectedLayerType).toBe(LayerType.Base);
    expect(result.current.isSelectedLayerVisible).toBe(true);
  });

  test('should return base layer as selected and invisible', () => {
    setupSelectedLayerWithVisibility(LayerType.Base, false);

    const { result } = renderHook(useSelectedLayerVisibility);

    expect(result.current.selectedLayerType).toBe(LayerType.Base);
    expect(result.current.isSelectedLayerVisible).toBe(false);
  });

  test('should return plants layer as selected and visible', () => {
    setupSelectedLayerWithVisibility(LayerType.Plants, true);

    const { result } = renderHook(useSelectedLayerVisibility);

    expect(result.current.selectedLayerType).toBe(LayerType.Plants);
    expect(result.current.isSelectedLayerVisible).toBe(true);
  });

  test('should return plants layer as selected and invisible', () => {
    setupSelectedLayerWithVisibility(LayerType.Plants, false);

    const { result } = renderHook(useSelectedLayerVisibility);

    expect(result.current.selectedLayerType).toBe(LayerType.Plants);
    expect(result.current.isSelectedLayerVisible).toBe(false);
  });

  test('should return plants layer as selected and visible when selecting it after having selected base layer and plants layer is still set visible', () => {
    setupSelectedLayerWithVisibility(LayerType.Base, true);
    selectLayerAndSetVisibility(LayerType.Plants, true);

    const { result } = renderHook(useSelectedLayerVisibility);

    expect(result.current.selectedLayerType).toBe(LayerType.Plants);
    expect(result.current.isSelectedLayerVisible).toBe(true);
  });

  test('should return plants layer as selected and still invisible when selecting it after having selected base layer and plants layer was previously set invisible', () => {
    setupSelectedLayerWithVisibility(LayerType.Plants, false);
    selectLayer(LayerType.Base);
    selectLayer(LayerType.Plants);

    const { result } = renderHook(useSelectedLayerVisibility);

    expect(result.current.selectedLayerType).toBe(LayerType.Plants);
    expect(result.current.isSelectedLayerVisible).toBe(false);
  });

  test('should return plants layer as selected and still invisible after setting it invisible and switching back and forth between different layers', () => {
    setupSelectedLayerWithVisibility(LayerType.Base, true);
    selectLayer(LayerType.Plants);
    setVisibilityOfLayer(LayerType.Plants, false);
    selectLayer(LayerType.Base);
    selectLayer(LayerType.Soil);
    selectLayer(LayerType.Plants);

    const { result } = renderHook(useSelectedLayerVisibility);

    expect(result.current.selectedLayerType).toBe(LayerType.Plants);
    expect(result.current.isSelectedLayerVisible).toBe(false);
  });

  test('should return plants layer as selected and still visible after toggling its visibility twice', () => {
    setupSelectedLayerWithVisibility(LayerType.Plants, true);
    setVisibilityOfLayer(LayerType.Plants, false);
    setVisibilityOfLayer(LayerType.Plants, true);

    const { result } = renderHook(useSelectedLayerVisibility);

    expect(result.current.selectedLayerType).toBe(LayerType.Plants);
    expect(result.current.isSelectedLayerVisible).toBe(true);
  });
});

function setupSelectedLayerWithVisibility(layerType: LayerType, visible: boolean) {
  useMapStore.setState(createStoreWithGivenLayerSelected(layerType));
  useMapStore.getState().updateLayerVisible(layerType, visible);
}

function createStoreWithGivenLayerSelected(
  layerType: LayerType,
): Pick<UntrackedMapSlice, 'untrackedState'> {
  return {
    untrackedState: {
      ...UNTRACKED_DEFAULT_STATE,
      selectedLayer: {
        ...(createSelectedLayerForStore(layerType) as LayerDto),
      },
    },
  };
}

function createSelectedLayerForStore(layerType: LayerType): LayerDto {
  return {
    ...(UNTRACKED_DEFAULT_STATE.selectedLayer as LayerDto),
    type_: layerType,
  };
}

function selectLayerAndSetVisibility(layerType: LayerType, visible: boolean) {
  selectLayer(layerType);
  setVisibilityOfLayer(layerType, visible);
}

function selectLayer(layerType: LayerType) {
  useMapStore.getState().updateSelectedLayer(createSelectedLayerForStore(layerType));
}

function setVisibilityOfLayer(layerType: LayerType, visible: boolean) {
  useMapStore.getState().updateLayerVisible(layerType, visible);
}
