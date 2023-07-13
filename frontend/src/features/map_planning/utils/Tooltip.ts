import { Stage } from 'konva/lib/Stage';
import { Label } from 'konva/lib/shapes/Label';

export function setTooltipPosition(tooltip: Label, stage: Stage) {
  const pos = stage.getRelativePointerPosition();
  tooltip.position({
    x: pos.x + 16 / stage.scaleX(),
    y: pos.y,
  });
}
