import { GetFn } from './MapStoreTypes';

/**
 * Handle the case where the selected nodes are not in the stage anymore.
 */
export function handleSelectedNodesChange(get: GetFn) {
  const stage = get().stageRef.current;
  const transformer = get().transformer.current;
  const selectedNodeIds = transformer?.getNodes().map((n) => n.id()) || [];

  const selectedNodesAreVisible = selectedNodeIds.every((id) => stage?.findOne(`#${id}`));

  if (!selectedNodesAreVisible) {
    transformer?.nodes([]);
    get().selectPlanting(null);
  }
}
