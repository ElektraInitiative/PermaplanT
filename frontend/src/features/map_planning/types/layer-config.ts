import Konva from 'konva';

import KonvaEventObject = Konva.KonvaEventObject;

/**
 * This type defines registration methods for event listeners that will be attached to
 * a layers enclosing stage.
 */
export interface StageListenerRegister {
  registerStageDragStartListener: (listener: (e: KonvaEventObject<DragEvent>) => void) => void;
  registerStageDragEndListener: (listener: (e: KonvaEventObject<DragEvent>) => void) => void;
  registerStageMouseMoveListener: (listener: (e: KonvaEventObject<MouseEvent>) => void) => void;
  registerStageMouseWheelListener: (listener: (e: KonvaEventObject<MouseEvent>) => void) => void;
  registerStageMouseDownListener: (listener: (e: KonvaEventObject<MouseEvent>) => void) => void;
  registerStageMouseUpListener: (listener: (e: KonvaEventObject<MouseEvent>) => void) => void;
  registerStageClickListener: (listener: (e: KonvaEventObject<MouseEvent>) => void) => void;
}

/**
 * Extension of Konva.LayerConfig with additional facilities that are commonly needed
 * by layers in PermaplanT.
 */
export type LayerConfigWithListenerRegister = Konva.LayerConfig & {
  stageListenerRegister: StageListenerRegister;
};
