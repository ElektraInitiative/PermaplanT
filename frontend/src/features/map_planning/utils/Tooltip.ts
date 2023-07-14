import { Stage } from 'konva/lib/Stage';
import { Label } from 'konva/lib/shapes/Label';

const MOUSE_OFFSET_X = 16;

export function setTooltipPosition(tooltip: Label, stage: Stage) {
  const pos = stage.getRelativePointerPosition();
  tooltip.position({
    x: pos.x + MOUSE_OFFSET_X / stage.scaleX(),
    y: pos.y,
  });
}
