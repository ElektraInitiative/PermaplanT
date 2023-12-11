import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { SelectionRectAttrs } from '../types/SelectionRectAttrs';
import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';
import { Util } from 'konva/lib/Util';
import { Transformer } from 'konva/lib/shapes/Transformer';

// Keep track of our previously selected shapes so we can trigger the selection
// only if we have new shapes in our bounds. This fixes a bug where deselection
// would happen after you moved a single or a group of selected shapes.
// Todo: optimization -> could probably use a set here
let previouslySelectedShapeIds: Set<number> = new Set();

export const SELECTION_RECTANGLE_NAME = 'selectionRect';

/** Select shapes that intersect with the selection rectangle. */
export const selectIntersectingShapes = (
  stageRef: React.RefObject<Stage>,
  trRef: React.RefObject<Transformer>,
) => {
  if (stageRef.current === null) return;
  const box = stageRef.current.findOne(`.${SELECTION_RECTANGLE_NAME}`).getClientRect();

  if (stageRef.current.children === null) return;

  // we don't always have to look for them, we can store them
  const allShapes = stageRef.current.children
    //filter out layers which are not selected
    ?.filter((layer) => layer.attrs.listening)
    .flatMap((layer) => layer.children)
    .filter((shape) => {
      // To exclude Konva's transformer, check if node contains children.
      // 'listening' is explicitly checked for '!== false' because
      // Konva treats it as true if it's undefined or missing at all.
      return shape?.attrs.listening !== false;
    });

  console.log('allShapes', allShapes);

  if (!allShapes) return;

  const allNodes = trRef.current?.getNodes();
  if (!allNodes) return;

  const mappedShapes = allShapes.map((shape) => {
    return shape as Shape<ShapeConfig>;
  });

  const intersectingShapes = mappedShapes.filter(
    (shape) => shape && Util.haveIntersection(box, shape.getClientRect()),
  );

  // If intersectingShape and previouslySelectedShapes are the same, don't update
  if (intersectingShapes.length === previouslySelectedShapeIds.size) {
    let same = true;
    for (const shape of intersectingShapes) {
      if (!previouslySelectedShapeIds.has(shape._id)) {
        same = false;
        break;
      }
    }
    if (same) return;
  }

  if (intersectingShapes) {
    const nodes = intersectingShapes.filter((shape) => shape !== undefined);
    previouslySelectedShapeIds = new Set(nodes.map((shape) => shape._id));
    setTransformerAnchors(trRef, nodes);
    trRef.current?.nodes(nodes);
  }
};

export const resetSelectionRectangleSize = (
  setSelectionRectAttrs: React.Dispatch<React.SetStateAction<SelectionRectAttrs>>,
) => {
  setSelectionRectAttrs((attrs) => ({ ...attrs, width: 0, height: 0 }));
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
) => {
  setSelectionRectAttrs((attrs) => ({
    ...attrs,
    isVisible: false,
  }));
};

export const selectSingleNode = (trRef: React.RefObject<Transformer>, node: Konva.Node) => {
  setTransformerAnchors(trRef, [node]);
  trRef.current?.nodes([node]);
};

const setTransformerAnchors = (trRef: React.RefObject<Transformer>, nodes: Konva.Node[]) => {
  if (nodes.length == 1 && nodes[0].attrs.canBeDistorted) {
    trRef.current?.enabledAnchors([
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
      'middle-left',
      'middle-right',
      'top-center',
      'bottom-center',
    ]);
  } else {
    trRef.current?.enabledAnchors(['top-left', 'top-right', 'bottom-left', 'bottom-right']);
  }
};
