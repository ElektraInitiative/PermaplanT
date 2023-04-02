import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { useRef, useState } from 'react';
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

  let scrollCount = 0;
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (stage == null) return;

    const pointerVector = stage.getPointerPosition();
    if (pointerVector == null) return;

    const pointerX = pointerVector.x;
    const pointerY = pointerVector.y;

    const scaleBy = 1.1;

    if (e.evt.ctrlKey) {
      const oldScale = stage.scaleX();
      const mousePointTo = {
        x: pointerX / oldScale - stage.x() / oldScale,
        y: pointerY / oldScale - stage.y() / oldScale,
      };

      const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

      if (newScale < 0.05) return;

      setStage({
        scale: newScale,
        x: (pointerX / newScale - mousePointTo.x) * newScale,
        y: (pointerY / newScale - mousePointTo.y) * newScale,
      });
    } else {
      const x = stage.position().x;
      const y = stage.position().y;
      const dx = e.evt.deltaX;
      const dy = e.evt.deltaY;
      const scrollingScalePx = 15;
      const diagonalScalingFactor = Math.sqrt(dx * dx + dy * dy) / scrollingScalePx;
      let decayFactor = 1;
      if (scrollCount > 0) {
        // decayFactor = 1 / (1 + (0.1 * scrollCount) / 2);
        decayFactor = 1;
      }

      if (dx !== 0 && dy !== 0) {
        stage.setPosition({
          x: x - (dx / diagonalScalingFactor) * decayFactor,
          y: y - (dy / diagonalScalingFactor) * decayFactor,
        });
      } else if (dx !== 0) {
        stage.setPosition({ x: x - (dx / scrollingScalePx) * decayFactor, y });
      } else if (dy !== 0) {
        stage.setPosition({ x, y: y - (dy / scrollingScalePx) * decayFactor });
      }

      scrollCount++;
    }
  };

  const findAndMarkSelected = () => {
    if (stageRef.current === null) return;
    const box = stageRef.current.findOne('.selectionRect').getClientRect();

    if (stageRef.current.children === null) return;

    // we dont always have to look for them, we can store them
    const allShapes = stageRef.current.children
      ?.flatMap((layer) => layer.children)
      .filter(
        (shape) => shape?.name() !== 'selectionRect' && !shape?.name().includes('transformer'),
      );

    if (!allShapes) return;
    const intersectingShapes = allShapes.filter(
      (shape) => shape && Konva.Util.haveIntersection(box, shape.getClientRect()),
    );

    if (intersectingShapes) {
      console.log('adding');
      const nodes = intersectingShapes.filter((shape) => shape !== undefined);
      trRef.current?.nodes(nodes as Shape<ShapeConfig>[]);
    }
  };

  const shadowLayerRef = useRef<Konva.Layer>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const removeSelectedShapes = () => {
    trRef.current?.nodes([]);
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

  let isSelectionEnabled = true;

  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.buttons !== 4) {
      document.body.style.cursor = 'default';
    }
    const stage = e.target.getStage();

    if (stage == null || !selectionRectAttrs.isVisible) return;

    e.evt.preventDefault();

    if (!isSelectionEnabled) return;

    const pointerVector = stage.getPointerPosition();
    if (pointerVector == null) return;

    const pointerX = pointerVector.x + stage.getPosition().x * -1;
    const pointerY = pointerVector.y + stage.getPosition().y * -1;

    setSelectionRectBoundingBox({
      ...selectionRectBoundingBox,
      x2: pointerX,
      y2: pointerY,
    });

    setSelectionRectAttrs({
      ...selectionRectAttrs,
      x: pointerX,
      y: pointerY,
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

    //findAndMarkSelected();
  };

  const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.buttons === 4) {
      document.body.style.cursor = 'grabbing';
    }
    const stage = e.target.getStage();
    if (stage == null) return;
    e.evt.preventDefault();

    if (!isSelectionEnabled) return;

    const pointerVector = stage.getPointerPosition();
    if (pointerVector == null) return;

    const pointerX = pointerVector.x + stage.getPosition().x * -1;
    const pointerY = pointerVector.y + stage.getPosition().y * -1;

    setSelectionRectBoundingBox({
      x1: pointerX,
      y1: pointerY,
      x2: pointerX,
      y2: pointerY,
    });
    setSelectionRectAttrs({
      ...selectionRectAttrs,
      x: pointerX,
      y: pointerY,
    });
    setSelectionRectAttrs({
      ...selectionRectAttrs,
      width: 0,
      height: 0,
      isVisible: true,
    });
  };

  const onMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    if (!isSelectionEnabled) return;

    if (selectionRectAttrs.isVisible) {
      setSelectionRectAttrs({
        ...selectionRectAttrs,
        isVisible: false,
      });
    }

    findAndMarkSelected();
  };

  const onClick = (e: KonvaEventObject<MouseEvent>) => {
    const isStage = e.target instanceof Konva.Stage;
    const nodeSize = trRef.current?.getNodes().length || 0;
    console.log(e.target);
    if (nodeSize > 0 && isStage) {
      removeSelectedShapes();
    }
  };

  const addToTransformer = (node: Shape<ShapeConfig>) => {
    const nodes = trRef.current?.getNodes() || [];
    if (!nodes.includes(node)) {
      trRef.current?.nodes([node]);
    }
  };

  // https://konvajs.org/docs/react/Access_Konva_Nodes.html
  const stageRef = useRef<Konva.Stage>(null);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Stage
        ref={stageRef}
        draggable={true}
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={handleWheel}
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
        <Layer>
          <Circle
            x={window.innerWidth / 2}
            y={window.innerHeight / 2}
            radius={50}
            fill="red"
            draggable={true}
            shadowBlur={5}
            onClick={(e: KonvaEventObject<MouseEvent>) => {
              const nodes = trRef.current?.getNodes() || [];
              if (!nodes.includes(e.target)) {
                trRef.current?.nodes([e.target]);
              }
            }}
          />
          <Circle
            draggable={true}
            x={window.innerWidth / 3}
            y={window.innerHeight / 3}
            radius={50}
            fill="green"
            shadowBlur={5}
            onClick={(e: KonvaEventObject<MouseEvent>) => {
              addToTransformer(e.target as Shape<ShapeConfig>);
            }}
          />
          <Circle
            x={window.innerWidth / 4}
            y={window.innerHeight / 4}
            radius={50}
            fill="green"
            shadowBlur={5}
            onClick={(e: KonvaEventObject<MouseEvent>) => {
              addToTransformer(e.target as Shape<ShapeConfig>);
            }}
          />
          <Circle
            x={window.innerWidth / 4}
            y={window.innerHeight / 5}
            radius={50}
            fill="green"
            shadowBlur={5}
            onClick={(e: KonvaEventObject<MouseEvent>) => {
              addToTransformer(e.target as Shape<ShapeConfig>);
            }}
          />
        </Layer>
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
            onTransformStart={(e: KonvaEventObject<MouseEvent>) => {
              console.log('down');
              isSelectionEnabled = false;
            }}
            onTransformEnd={(e: KonvaEventObject<MouseEvent>) => {
              console.log('up');
              isSelectionEnabled = true;
            }}
            ref={trRef}
            name="transformer"
            anchorSize={8}
          />
        </Layer>
        <Layer ref={shadowLayerRef} />
      </Stage>
    </div>
  );
};
