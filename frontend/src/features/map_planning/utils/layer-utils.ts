import { LayerType } from '@/api_types/definitions';
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
  return selectedLayerType === LayerType.Plants;
}

export function useIsBaseLayerActive(): boolean {
  const selectedLayerType = useSelectedLayerType();
  return selectedLayerType === LayerType.Base;
}

export function useIsDrawingLayerActive(): boolean {
  const selectedLayerType = useSelectedLayerType();
  return selectedLayerType === LayerType.Drawing;
}

/**
 * Filters an array of objects by their IDs.
 *
 * @param array - The array of objects to filter.
 * @param ids - The array of IDs to filter by.
 * @returns An array of objects that have IDs matching the provided IDs.
 */
export function filterByIds<T extends { id: unknown }>(array: T[], ids: unknown[]): T[] {
  return array.filter((e) => ids.includes(e.id));
}
