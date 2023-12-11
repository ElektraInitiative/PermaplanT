import { DeleteDrawingAction } from '../actions';
import useMapStore from '@/features/map_planning/store/MapStore';

export function useDeleteSelectedDrawings() {
  const selectedDrawings = useMapStore(
    (state) => state.untrackedState.layers.drawing.selectedDrawings,
  );

  const executeAction = useMapStore((state) => state.executeAction);
  const selectDrawings = useMapStore((state) => state.selectDrawings);
  const transformerRef = useMapStore((state) => state.transformer);

  const deleteSelectedDrawings = () => {
    if (!selectedDrawings?.length) return;

    selectedDrawings.forEach((selectedDrawings) =>
      executeAction(new DeleteDrawingAction({ id: selectedDrawings.id })),
    );

    selectDrawings(null);
    transformerRef.current?.nodes([]);
  };

  return {
    deleteSelectedDrawings,
  };
}
