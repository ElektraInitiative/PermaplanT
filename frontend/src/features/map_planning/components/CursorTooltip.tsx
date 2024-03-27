import useMapStore from '../store/MapStore';
import { MapLabel } from '../utils/MapLabel';

export function CursorTooltip() {
  const tooltipContent = useMapStore((store) => store.untrackedState.tooltipContent);
  const tooltipPosition = useMapStore((state) => state.untrackedState.tooltipPosition);
  const stage = useMapStore((state) => state.stageRef);

  return (
    <MapLabel
      content={tooltipContent}
      visible={tooltipContent !== ''}
      scaleX={2 / (stage.current?.scaleX() ?? 1)}
      scaleY={2 / (stage.current?.scaleY() ?? 1)}
      x={tooltipPosition.x}
      y={tooltipPosition.y}
    />
  );
}
