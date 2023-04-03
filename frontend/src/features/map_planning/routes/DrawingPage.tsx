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
import { Circle, Layer, Rect, Stage, Transformer } from 'react-konva';

export const DrawingPage = () => {
  const [stage, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  const [selectionRectAttrs, setSelectionRectAttrs] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isVisible: false,
  });

  const [selectionRectBoundingBox, setSelectionRectBoundingBox] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const trRef = useRef<Konva.Transformer>(null);

  // https://konvajs.org/docs/react/Access_Konva_Nodes.html
  const stageRef = useRef<Konva.Stage>(null);

  let isSelectionEnabled = true;

  const onWheel = (e: KonvaEventObject<WheelEvent>) => {
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

  const onDragStart = (e: KonvaEventObject<DragEvent>) => {
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

  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.buttons !== 4) {
      document.body.style.cursor = 'default';
    }
    const stage = e.target.getStage();

    if (stage == null || !selectionRectAttrs.isVisible) return;

    e.evt.preventDefault();

    if (!isSelectionEnabled) return;

    updateSelection(
      stage,
      setSelectionRectAttrs,
      selectionRectAttrs,
      setSelectionRectBoundingBox,
      selectionRectBoundingBox,
    );
  };

  const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.buttons === 4) {
      document.body.style.cursor = 'grabbing';
    }
    const stage = e.target.getStage();
    if (stage == null) return;
    e.evt.preventDefault();

    if (!isSelectionEnabled) return;

    startSelection(stage, setSelectionRectAttrs, setSelectionRectBoundingBox);
  };

  const onMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    if (!isSelectionEnabled) return;

    endSelection(setSelectionRectAttrs, selectionRectAttrs);
    selectIntersectingShapes(stageRef, trRef);
  };

  const onClick = (e: KonvaEventObject<MouseEvent>) => {
    const isStage = e.target instanceof Konva.Stage;
    const nodeSize = trRef.current?.getNodes().length || 0;
    if (nodeSize > 0 && isStage) {
      unselectShapes(trRef);
    }
  };

  const addToTransformer = (node: Shape<ShapeConfig>) => {
    const nodes = trRef.current?.getNodes() || [];
    if (!nodes.includes(node)) {
      trRef.current?.nodes([node]);
    }
  };

  const [circles, setCircles] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const newCircles = [];
    for (let i = 1; i <= 10; i++) {
      newCircles.push(
        <Circle
          key={i}
          x={100 * i}
          y={100 * i}
          radius={50}
          fill="red"
          draggable={true}
          shadowBlur={5}
          onClick={(e: KonvaEventObject<MouseEvent>) => {
            addToTransformer(e.target as Shape<ShapeConfig>);
          }}
        />,
      );
    }
    setCircles(newCircles);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Stage
        ref={stageRef}
        draggable={true}
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={onWheel}
        onDragStart={onDragStart}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onClick={onClick}
        scaleX={stage.scale}
        scaleY={stage.scale}
        x={stage.x}
        y={stage.y}
      >
        <Layer>{circles.map((circle) => circle)}</Layer>
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
            ref={trRef}
            name="transformer"
            anchorSize={8}
          />
        </Layer>
      </Stage>
    </div>
  );
};
