import { SelectionRectAttrs } from '../types/selectionRectAttrs';
import {
  endSelection,
  selectIntersectingShapes,
  startSelection,
  unselectShapes,
  updateSelection,
} from '../utils/ShapesSelection';
import { handleScroll, handleZoom } from '../utils/StageTransform';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';

interface BaseStageProps {
  children: React.ReactNode;
}

export const BaseStage = (props: BaseStageProps) => {
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

  const trRef = useRef<Konva.Transformer>(null);

  // https://konvajs.org/docs/react/Access_Konva_Nodes.html
  const stageRef = useRef<Konva.Stage>(null);

  // We need this to disable selection when we are transforming
  let isSelectionEnabled = true;

  // Event listener responsible for allowing zooming with the ctrl key + mouse wheel
  const onStageWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (stage == null) return;

    const pointerVector = stage.getPointerPosition();
    if (pointerVector == null) return;

    if (e.evt.ctrlKey) {
      handleZoom(pointerVector, e.evt.deltaY, stage, setStage);
    } else {
      handleScroll(e.evt.deltaX, e.evt.deltaY, stage);
    }
  };

  // Event listener responsible for allowing dragging of the stage only with the wheel mouse button
  const onStageDragStart = (e: KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (stage == null) return;
    if (e.evt.buttons) {
      if (e.evt.buttons !== 4 && e.target === stage) {
        stage.stopDrag();
      }
      if (e.evt.buttons === 4 && e.target._id === 270) {
        stage.startDrag();
      }
    }
  };

  // Event listener responsible for updating the selection rectangle
  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    if (e.evt.buttons !== 4) {
      document.body.style.cursor = 'default';
    }

    const stage = e.target.getStage();
    if (stage == null || !selectionRectAttrs.isVisible) return;

    if (!isSelectionEnabled) return;
    updateSelection(stage, setSelectionRectAttrs);
    selectIntersectingShapes(stageRef, trRef);
  };

  // Event listener responsible for positioning the selection rectangle to the current mouse position
  const onStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    if (e.evt.buttons === 4) {
      document.body.style.cursor = 'grabbing';
    }

    const stage = e.target.getStage();
    if (stage == null) return;

    if (!isSelectionEnabled) return;
    startSelection(stage, setSelectionRectAttrs);
  };

  // Event listener responsible for ending the selection rectangle
  const onStageMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    if (!isSelectionEnabled) return;
    endSelection(setSelectionRectAttrs, selectionRectAttrs);
  };

  // Event listener responsible for unselecting shapes when clicking on the stage
  const onStageClick = (e: KonvaEventObject<MouseEvent>) => {
    const isStage = e.target instanceof Konva.Stage;
    const nodeSize = trRef.current?.getNodes().length || 0;
    if (nodeSize > 0 && isStage) {
      unselectShapes(trRef);
    }
  };

  // Event listener responsible for adding a single shape to the transformer
  const addToTransformer = (node: Shape<ShapeConfig>) => {
    const nodes = trRef.current?.getNodes() || [];
    if (!nodes.includes(node)) {
      trRef.current?.nodes([node]);
    }
  };

  useEffect(() => {
    if (stageRef.current?.children === null) return;

    // Add an event listener to all shapes except transformer and selectionRect
    // Reason is so a shape can be selected/transformed on a single click
    stageRef.current?.children
      ?.flatMap((layer) => layer.children)
      .filter(
        (shape) => shape?.name() !== 'selectionRect' && !shape?.name().includes('transformer'),
      )
      .forEach((shape) => {
        shape?.addEventListener('click', () => addToTransformer(shape as Shape<ShapeConfig>));
      });
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Stage
        ref={stageRef}
        draggable={true}
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={onStageWheel}
        onDragStart={onStageDragStart}
        onMouseDown={onStageMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onStageMouseUp}
        onClick={onStageClick}
        scaleX={stage.scale}
        scaleY={stage.scale}
        x={stage.x}
        y={stage.y}
      >
        {props.children}
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
            onTransformStart={() => {
              isSelectionEnabled = false;
            }}
            onTransformEnd={() => {
              isSelectionEnabled = true;
            }}
            onMouseDown={() => {
              isSelectionEnabled = false;
            }}
            onMouseUp={() => {
              isSelectionEnabled = true;
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
