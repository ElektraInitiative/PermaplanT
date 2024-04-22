import { LayerDto, LayerType } from '@/api_types/definitions';
import { FrontendOnlyLayerType } from '@/features/map_planning/layers/_frontend_only';
import type { GetFn } from './MapStoreTypes';
import { useTransformerStore } from './transformer/TransformerStore';

/**
 * If any of the selected nodes can not be found on the map, clear the selection.
 */
export function clearInvalidSelection(get: GetFn) {
  const stage = get().stageRef.current;
  const transformerActions = useTransformerStore.getState().actions;
  const selectedNodeIds = transformerActions.getSelection().map((n) => n.id()) || [];

  const selectedNodesAreVisible = selectedNodeIds.every((id) => stage?.findOne(`#${id}`));

  if (!selectedNodesAreVisible) {
    transformerActions.clearSelection();
    get().selectPlantings(null);
  }
}

export function typeOfLayer(
  layer: LayerDto | FrontendOnlyLayerType,
): FrontendOnlyLayerType | LayerType {
  if (!(typeof layer === 'object' && 'type_' in layer)) {
    return layer;
  }

  return layer.type_;
}
