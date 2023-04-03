import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Stage } from 'konva/lib/Stage';
import { Util } from 'konva/lib/Util';
import { Transformer } from 'konva/lib/shapes/Transformer';

/** Selects shapes that intersect with the selection rectangle */
export const selectIntersectingShapes = (
  stageRef: React.RefObject<Stage>,
  trRef: React.RefObject<Transformer>,
) => {
  if (stageRef.current === null) return;
  const box = stageRef.current.findOne('.selectionRect').getClientRect();

  if (stageRef.current.children === null) return;

  // we dont always have to look for them, we can store them
  const allShapes = stageRef.current.children
    ?.flatMap((layer) => layer.children)
    .filter((shape) => shape?.name() !== 'selectionRect' && !shape?.name().includes('transformer'));

  if (!allShapes) return;
  const intersectingShapes = allShapes.filter(
    (shape) => shape && Util.haveIntersection(box, shape.getClientRect()),
  );

  if (intersectingShapes) {
    const nodes = intersectingShapes.filter((shape) => shape !== undefined);
    trRef.current?.nodes(nodes as Shape<ShapeConfig>[]);
  }
};

/** Unselects the shapes */
export const unselectShapes = (trRef: React.RefObject<Transformer>) => {
  trRef.current?.nodes([]);
};

export const startSelection = (
  stage: Stage,
  setSelectionRectAttrs: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      width: number;
      height: number;
      isVisible: boolean;
    }>
  >,
  setSelectionRectBoundingBox: React.Dispatch<
    React.SetStateAction<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }>
  >,
) => {
  const pointerVector = stage.getPointerPosition();
  if (pointerVector == null) return;

  const pointerX = pointerVector.x + stage.getPosition().x * -1;
  const pointerY = pointerVector.y + stage.getPosition().y * -1;

  const scale = stage.scale();
  if (scale !== undefined) {
    // We need to adjust the selection box based on the stage's scale.
    // The scale might change due to zooming.
    setSelectionRectBoundingBox({
      x1: pointerX / scale.x,
      y1: pointerY / scale.y,
      x2: pointerX / scale.x,
      y2: pointerY / scale.y,
    });
    setSelectionRectAttrs({
      x: pointerX,
      y: pointerY,
      width: 0,
      height: 0,
      isVisible: true,
    });
  }
};

export const updateSelection = (
  stage: Stage,
  setSelectionRectAttrs: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      width: number;
      height: number;
      isVisible: boolean;
    }>
  >,
  selectionRectAttrs: {
    x: number;
    y: number;
    width: number;
    height: number;
    isVisible: boolean;
  },
  setSelectionRectBoundingBox: React.Dispatch<
    React.SetStateAction<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }>
  >,
  selectionRectBoundingBox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  },
) => {
  const pointerVector = stage.getPointerPosition();
  if (pointerVector == null) return;

  const pointerX = pointerVector.x + stage.getPosition().x * -1;
  const pointerY = pointerVector.y + stage.getPosition().y * -1;

  const scale = stage.scale();

  if (scale !== undefined) {
    setSelectionRectBoundingBox({
      ...selectionRectBoundingBox,
      x2: pointerX / scale.x,
      y2: pointerY / scale.y,
    });

    const x1 = selectionRectBoundingBox.x1;
    const y1 = selectionRectBoundingBox.y1;
    const x2 = selectionRectBoundingBox.x2;
    const y2 = selectionRectBoundingBox.y2;

    setSelectionRectAttrs({
      ...selectionRectAttrs,
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });
  }
};

export const endSelection = (
  setSelectionRectAttrs: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      width: number;
      height: number;
      isVisible: boolean;
    }>
  >,
  selectionRectAttrs: {
    x: number;
    y: number;
    width: number;
    height: number;
    isVisible: boolean;
  },
) => {
  if (selectionRectAttrs.isVisible) {
    setSelectionRectAttrs({
      ...selectionRectAttrs,
      isVisible: false,
    });
  }
};
