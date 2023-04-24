import { SelectionRectAttrs } from '../types/SelectionRectAttrs';
import {
  deselectShapes,
  endSelection,
  selectIntersectingShapes,
  startSelection,
  updateSelection,
} from '../utils/ShapesSelection';
import { handleScroll, handleZoom } from '../utils/StageTransform';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { useRef, useState } from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';

interface BaseStageProps {
  zoomable?: boolean;
  scrollable?: boolean;
  selectable?: boolean;
  draggable?: boolean;
  onWheel?: (event: KonvaEventObject<WheelEvent>) => void;
  onDragStart?: (event: KonvaEventObject<DragEvent>) => void;
  onMouseMove?: (event: KonvaEventObject<MouseEvent>) => void;  
  onMouseDown?: (event: KonvaEventObject<MouseEvent>) => void;  
  onMouseUp?: (event: KonvaEventObject<MouseEvent>) => void;  
  onClick?: (event: KonvaEventObject<MouseEvent>) => void;  
  children: React.ReactNode;
}

/**
 * This component is responsible for rendering the base stage that the user is going to draw on.
 *
 * It supports the following features out of the box and are enabled by default:
 *  - Zooming
 *  - Scrolling
 *  - Select & Multi-Select
 *  - Dragging
 */
export const BaseStage = ({
  children,
  onWheel,
  onDragStart,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onClick,
  zoomable = true,
  scrollable = true,
  selectable = true,
  draggable = true,
}: BaseStageProps) => {
  // Represents the state of the stage
  const [stage, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  // Represents the state of the current selection rectangle
  const [selectionRectAttrs, setSelectionRectAttrs] = useState<SelectionRectAttrs>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isVisible: false,
    boundingBox: {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    },
  });

  // Ref to the transformer
  const trRef = useRef<Konva.Transformer>(null);

  // https://konvajs.org/docs/react/Access_Konva_Nodes.html
  // Ref to the stage
  const stageRef = useRef<Konva.Stage>(null);

  // Event listener responsible for allowing zooming with the ctrl key + mouse wheel
  const onStageWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (stage === null) return;

    const pointerVector = stage.getPointerPosition();
    if (pointerVector === null) return;

    if (e.evt.ctrlKey) {
      if (zoomable) {
        handleZoom(pointerVector, e.evt.deltaY, stage, setStage);
      }
    } else {
      if (scrollable) {
        handleScroll(e.evt.deltaX, e.evt.deltaY, stage);
      }
    }

    if (onWheel != undefined) onWheel(e);
  };

  // Event listener responsible for allowing dragging of the stage only with the wheel mouse button
  const onStageDragStart = (e: KonvaEventObject<DragEvent>) => {
    if (e.evt === null || e.evt === undefined) return;
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (stage === null) return;

    // If the mouse pointer is starting the drag on an element that is not a stage then we don't drag
    // It works for now but there should be a better way since it's a bit wonky
    // Should work better with .draggable(false)
    if (e.evt.buttons) {
      if (e.evt.buttons !== 4 && e.target === stage) {
        stage.stopDrag();
      }
      if (e.evt.buttons === 4 && e.target !== stage) {
        stage.stopDrag();
      }
    }

    if (onDragStart != undefined) onDragStart(e);
  };

  // Event listener responsible for updating the selection rectangle
  const onStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    if (e.evt.buttons === 4) return;

    if (e.evt.buttons !== 4) {
      document.body.style.cursor = 'default';
    }

    const stage = e.target.getStage();
    const layerListening = e.target.getLayer() != null ? e.target.getLayer().isListening() : false;
    if (stage === null || !selectionRectAttrs.isVisible || !layerListening || !selectable) return;

    updateSelection(stage, setSelectionRectAttrs);
    selectIntersectingShapes(stageRef, trRef);

    if (onMouseMove != undefined) onMouseMove(e);
  };

  // Event listener responsible for positioning the selection rectangle to the current mouse position
  const onStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    if (e.evt.buttons === 4) {
      document.body.style.cursor = 'grabbing';
    }

    const stage = e.target.getStage();
    const layerListening = e.target.getLayer() != null ? e.target.getLayer().isListening() : false;
    if (stage == null || !layerListening || !selectable) return;

    startSelection(stage, setSelectionRectAttrs);

    if (onMouseDown != undefined) onMouseDown(e);
  };

  // Event listener responsible for ending the selection rectangle
  const onStageMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    if (!selectable) return;
    endSelection(setSelectionRectAttrs, selectionRectAttrs);

    if (onMouseUp != undefined) onMouseUp(e);
  };

  // Event listener responsible for unselecting shapes when clicking on the stage
  const onStageClick = (e: KonvaEventObject<MouseEvent>) => {
    const isStage = e.target instanceof Konva.Stage;
    const nodeSize = trRef.current?.getNodes().length || 0;
    if (nodeSize > 0 && isStage) {
      deselectShapes(trRef);
    }

    if (onClick != undefined) onClick(e);
  };

  // Event listener responsible for adding a single shape to the transformer
  const addToTransformer = (node: Shape<ShapeConfig>) => {
    const nodes = trRef.current?.getNodes() || [];
    if (!nodes.includes(node)) {
      trRef.current?.nodes([node]);
    }
  };

  // Add event listeners to all shapes
  // This will trigger on every rerender, maybe this could be improved?
  stageRef.current?.children
    ?.flatMap((layer) => layer.children)
    .filter((shape) => shape?.name() !== 'selectionRect' && !shape?.name().includes('transformer'))
    .forEach((shape) => {
      if (!shape?.eventListeners['click']) {
        shape?.addEventListener('click', () => {
          addToTransformer(shape as Shape<ShapeConfig>);
        });
      }
    });

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Stage
        ref={stageRef}
        draggable={draggable}
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={onStageWheel}
        onDragStart={onStageDragStart}
        onMouseDown={onStageMouseDown}
        onMouseMove={onStageMouseMove}
        onMouseUp={onStageMouseUp}
        onClick={onStageClick}
        scaleX={stage.scale}
        scaleY={stage.scale}
        x={stage.x}
        y={stage.y}
      >
        {children}
        <Layer>
          <Rect
            x={selectionRectAttrs.x}
            y={selectionRectAttrs.y}
            width={selectionRectAttrs.width}
            height={selectionRectAttrs.height}
            fill={'blue'}
            visible={selectionRectAttrs.isVisible}
            opacity={0.2}
            name="selectionRect"
          />
          <Transformer
            // We need to manually disable selection when we are transforming
            onTransformStart={() => {
              selectable = false;
            }}
            onTransformEnd={() => {
              selectable = true;
            }}
            onMouseDown={() => {
              selectable = false;
            }}
            onMouseUp={() => {
              selectable = true;
            }}
            ref={trRef}
            name="transformer"
            anchorSize={8}
            // shouldOverdrawWholeAre allows us to use the whole transformer area for dragging.
            // It's an experimental property so we should keep an eye out for possible issues
            shouldOverdrawWholeArea={true}
          />
        </Layer>
      </Stage>
    </div>
  );
};
