import useMapStore from '../store/MapStore';
import { useTransformerStore } from '../store/transformer/TransformerStore';
import { MapLabel } from '../utils/MapLabel';

export function CursorTooltip() {
  const tooltipContent = useMapStore((store) => store.untrackedState.tooltipContent);
  const tooltipPosition = useMapStore((state) => state.untrackedState.tooltipPosition);
  const stage = useMapStore((state) => state.stageRef);
  const isTransforming = useTransformerStore((state) => state.actions.isTransforming());

  const isVisible = tooltipContent !== '' && !isTransforming;

  return (
    <MapLabel
      content={tooltipContent}
      visible={isVisible}
      scaleX={2 / (stage.current?.scaleX() ?? 1)}
      scaleY={2 / (stage.current?.scaleY() ?? 1)}
      x={tooltipPosition.x}
      y={tooltipPosition.y}
    />
  );
}
