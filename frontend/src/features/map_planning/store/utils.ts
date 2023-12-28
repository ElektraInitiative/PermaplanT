import type { GetFn } from './MapStoreTypes';
import { LayerDto, LayerType } from '@/api_types/definitions';
import { FrontendOnlyLayerType } from '@/features/map_planning/layers/_frontend_only';

/**
 * If any of the selected nodes can not be found on the map, clear the selection.
 */
export function clearInvalidSelection(get: GetFn) {
  const stage = get().stageRef.current;
  const transformer = get().transformer.current;
  const selectedNodeIds = transformer?.getNodes().map((n) => n.id()) || [];

  const selectedNodesAreVisible = selectedNodeIds.every((id) => stage?.findOne(`#${id}`));

  if (!selectedNodesAreVisible) {
    transformer?.nodes([]);
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
