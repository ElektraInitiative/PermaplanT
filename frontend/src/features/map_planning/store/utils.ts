import type { GetFn } from './MapStoreTypes';

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
