import Konva from 'konva';

import KonvaEventObject = Konva.KonvaEventObject;

/**
 * This type defines registration methods for event listeners that will be attached to
 * a layers enclosing stage.
 */
export interface StageListenerRegister {
  registerStageDragStartListener: (
    key: string,
    listener: (e: KonvaEventObject<DragEvent>) => void,
  ) => void;
  registerStageDragEndListener: (
    key: string,
    listener: (e: KonvaEventObject<DragEvent>) => void,
  ) => void;
  registerStageMouseMoveListener: (
    key: string,
    listener: (e: KonvaEventObject<MouseEvent>) => void,
  ) => void;
  registerStageMouseWheelListener: (
    key: string,
    listener: (e: KonvaEventObject<MouseEvent>) => void,
  ) => void;
  registerStageMouseDownListener: (
    key: string,
    listener: (e: KonvaEventObject<MouseEvent>) => void,
  ) => void;
  registerStageMouseUpListener: (
    key: string,
    listener: (e: KonvaEventObject<MouseEvent>) => void,
  ) => void;
  registerStageClickListener: (
    key: string,
    listener: (e: KonvaEventObject<MouseEvent>) => void,
  ) => void;
}

/**
 * Extension of Konva.LayerConfig with additional facilities that are commonly needed
 * by layers in PermaplanT.
 */
export type LayerConfigWithListenerRegister = Konva.LayerConfig & {
  stageListenerRegister: StageListenerRegister;
};
