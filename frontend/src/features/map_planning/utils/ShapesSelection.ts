import { SelectionRectAttrs } from '../types/SelectionRectAttrs';
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Stage } from 'konva/lib/Stage';
import { Util } from 'konva/lib/Util';
import { Transformer } from 'konva/lib/shapes/Transformer';

// Keeps track of the previous transformer nodes so we can add additional nodes to
// the transformer when drawing a new selection rectangle with a modifier key pressed.
let previousTransformerSelection: Shape<ShapeConfig>[] = [];

export const SELECTION_RECTANGLE_NAME = 'selectionRect';

/** Select shapes that intersect with the selection rectangle. */
export const selectIntersectingShapes = (
  stageRef: React.RefObject<Stage>,
  transformerRef: React.RefObject<Transformer>,
  konvaEvent: KonvaEventObject<MouseEvent>,
) => {
  const existingShapes = getExistingShapesOnStage(stageRef);
  if (existingShapes.length === 0) return;

  const selectedShapes = getIntersectedShapes(stageRef.current as Stage, existingShapes);

  if (isUsingModiferKey(konvaEvent)) {
    addAdditionalShapesToTransformer(selectedShapes, transformerRef);
    return;
  }

  setShapesInTransformer(selectedShapes, transformerRef);
};

/** Resets current selection by removing all nodes from the transformer */
export const resetTransformerSelection = (trRef: React.RefObject<Transformer>) => {
  trRef.current?.nodes([]);
};

/** Sets up the selection rectangle by positioning it at the current mouse position. */
export const initializeSelectionRectangle = (
  stage: Stage,
  setSelectionRectAttrs: React.Dispatch<React.SetStateAction<SelectionRectAttrs>>,
) => {
  const pointerVector = stage.getPointerPosition();
  if (pointerVector == null) return;

  const pointerX = pointerVector.x + stage.getPosition().x * -1;
  const pointerY = pointerVector.y + stage.getPosition().y * -1;

  const scale = stage.scale();
  if (scale !== undefined) {
    // We need to adjust the selection box based on the stage's scale.
    // The scale might change due to zooming.
    setSelectionRectAttrs({
      x: pointerX,
      y: pointerY,
      width: 0,
      height: 0,
      isVisible: true,
      boundingBox: {
        x1: pointerX / scale.x,
        y1: pointerY / scale.y,
        x2: pointerX / scale.x,
        y2: pointerY / scale.y,
      },
    });
  }
};

/** Update the selection rectangle's size based on the current mouse position. */
export const updateSelectionRectangle = (
  stage: Stage,
  setSelectionRectAttrs: React.Dispatch<React.SetStateAction<SelectionRectAttrs>>,
) => {
  const pointerVector = stage.getPointerPosition();
  if (pointerVector == null) return;

  // We need to adjust the selection box based on the stage's position.
  // The position might change due to dragging the stage.
  const pointerX = pointerVector.x + stage.getPosition().x * -1;
  const pointerY = pointerVector.y + stage.getPosition().y * -1;

  const scale = stage.scale();

  if (scale !== undefined) {
    setSelectionRectAttrs((prevSelectionRectAttrs) => {
      const x1 = prevSelectionRectAttrs.boundingBox.x1;
      const y1 = prevSelectionRectAttrs.boundingBox.y1;
      const x2 = pointerX / scale.x;
      const y2 = pointerY / scale.y;

      return {
        ...prevSelectionRectAttrs,
        boundingBox: {
          ...prevSelectionRectAttrs.boundingBox,
          x2: x2,
          y2: y2,
        },
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
      };
    });
  }
};

/** Ends the selection by making the selection rectangle invisible. */
export const hideSelectionRectangle = (
  setSelectionRectAttrs: React.Dispatch<React.SetStateAction<SelectionRectAttrs>>,
  selectionRectAttrs: SelectionRectAttrs,
) => {
  if (selectionRectAttrs.isVisible) {
    setSelectionRectAttrs({
      ...selectionRectAttrs,
      isVisible: false,
    });
  }
};

export const updatePreviousTransformerSelection = (
  transformerRef: React.RefObject<Transformer>,
): void => {
  previousTransformerSelection = transformerRef.current?.nodes().slice() as Shape<ShapeConfig>[];
};

export const isUsingModiferKey = (konvaEvent: KonvaEventObject<MouseEvent>): boolean => {
  return konvaEvent.evt.ctrlKey || konvaEvent.evt.shiftKey || konvaEvent.evt.metaKey;
};

function getExistingShapesOnStage(stageRef: React.RefObject<Stage>): Shape<ShapeConfig>[] {
  const nodes =
    stageRef.current?.children
      //filter out layers which are not selected
      ?.filter((layer) => layer.attrs.listening)
      .flatMap((layer) => layer.children)
      .filter((node) => {
        // To exclude Konva's transformer, check if node contains children.
        // 'listening' is explicitly checked for '!== false' because
        // Konva treats it as true if it's undefined or missing at all.
        return node?.attrs.listening !== false && node?.hasChildren();
      }) ?? [];

  return nodes.map((node) => node as Shape<ShapeConfig>);
}

function getIntersectedShapes(
  stage: Stage,
  existingShapes: Shape<ShapeConfig>[],
): Shape<ShapeConfig>[] {
  const box = stage.findOne(`.${SELECTION_RECTANGLE_NAME}`).getClientRect();

  return existingShapes.filter((shape) => Util.haveIntersection(box, shape.getClientRect()));
}

function addAdditionalShapesToTransformer(
  selectedShapes: Shape[],
  transformerRef: React.RefObject<Transformer>,
): void {
  const updatedSelection = new Set([...previousTransformerSelection, ...selectedShapes]);
  transformerRef.current?.nodes([...updatedSelection]);
}

function setShapesInTransformer(
  selectedShapes: Shape<ShapeConfig>[],
  transformerRef: React.RefObject<Transformer>,
): void {
  transformerRef.current?.nodes(selectedShapes);
}
