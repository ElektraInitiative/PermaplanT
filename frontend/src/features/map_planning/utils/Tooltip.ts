import useMapStore from '@/features/map_planning/store/MapStore';

const MOUSE_OFFSET_X = 16;

/**
 * Sets the tooltips position to the current mouse cursor position.
 */
export function setTooltipPositionToMouseCursor() {
  const stage = useMapStore.getState().stageRef.current;

  if (!stage) return;

  const pos = stage.getRelativePointerPosition();
  useMapStore.getState().setTooltipPosition({
    x: pos.x + MOUSE_OFFSET_X / stage.scaleX(),
    y: pos.y,
  });
}

/**
 * Display the tooltip.
 *
 * @param text Content that will be displayed in on the tooltip.
 */
export function showTooltipWithContent(text: string) {
  useMapStore.getState().setTooltipText(text);
}

/**
 * Hide the tooltip.
 */
export function hideTooltip() {
  useMapStore.getState().setTooltipText('');
}
