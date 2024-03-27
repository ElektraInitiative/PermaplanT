import { KonvaEventObject } from 'konva/lib/Node';

export function isUsingModifierKey(e: KonvaEventObject<MouseEvent>): boolean {
  return e.evt.ctrlKey || e.evt.shiftKey || e.evt.metaKey;
}
