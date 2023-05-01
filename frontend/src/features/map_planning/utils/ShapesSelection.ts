import { SelectionRectAttrs } from '../types/SelectionRectAttrs';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Stage } from 'konva/lib/Stage';
import { Util } from 'konva/lib/Util';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { element } from 'prop-types';

// Keep track of our previously selected shapes so we can trigger the selection
// only if we have new shapes in our bounds. This fixes a bug where deselection
// would happen after you moved a single or a group of selected shapes.
// Todo: optimization -> could probably use a set here
let previouslySelectedShapes: Shape<ShapeConfig>[] = [];

/** Select shapes that intersect with the selection rect. */
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
    .filter((shape) => shape?.name() !== 'selectionRect' && !shape?.name().includes('transformer'))
    // ignore shapes from non editable layers
    .filter((shape) => shape?.getLayer()?.isListening());

  if (!allShapes) return;

  const allNodes = trRef.current?.getNodes();
  if (!allNodes) return;

  const mappedShapes = allShapes.map((shape) => {
    return shape as Shape<ShapeConfig>;
  });

  const intersectingShapes = mappedShapes.filter(
    (shape) => shape && Util.haveIntersection(box, shape.getClientRect()),
  );

  // If intersectingShape and previouslySelectedShapes are the same, dont update
  if (intersectingShapes.length === previouslySelectedShapes.length) {
    let same = true;
    for (const shape of intersectingShapes) {
      if (!previouslySelectedShapes.map((node) => node._id).includes(shape._id)) {
        same = false;
        break;
      }
    }
    if (same) return;
  }

  if (intersectingShapes) {
    const nodes = intersectingShapes.filter((shape) => shape !== undefined);
    previouslySelectedShapes = nodes;
    trRef.current?.nodes(nodes);
  }
};

/** Deselects the shapes */
export const deselectShapes = (trRef: React.RefObject<Transformer>) => {
  trRef.current?.nodes([]);
};

/** Starts the selection and positions the selection rect to the current mouse position. */
export const startSelection = (
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

/** Update the selection box's size based on mouse position. */
export const updateSelection = (
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

/** Ends the selection which means the selection rect turns invisible. */
export const endSelection = (
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
