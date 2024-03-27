import useMapStore from '@/features/map_planning/store/MapStore';
import { useTransformerStore } from '@/features/map_planning/store/transformer/TransformerStore';
import { DeleteDrawingAction } from '../actions';

export function useDeleteSelectedDrawings() {
  const selectedDrawings = useMapStore(
    (state) => state.untrackedState.layers.drawing.selectedDrawings,
  );

  const executeAction = useMapStore((state) => state.executeAction);
  const selectDrawings = useMapStore((state) => state.selectDrawings);
  const transformerActions = useTransformerStore().actions;

  const deleteSelectedDrawings = () => {
    if (!selectedDrawings?.length) return;

    executeAction(new DeleteDrawingAction(selectedDrawings.map((d) => d.id)));

    selectDrawings(null);
    transformerActions.clearSelection();
  };

  return {
    deleteSelectedDrawings,
  };
}
