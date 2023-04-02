import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';
import { Circle, Layer, Rect, Stage } from 'react-konva';

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

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Stage
        draggable={true}
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={handleWheel}
        onDragStart={onDragStart}
        onMouseDown={(e: KonvaEventObject<MouseEvent>) => {
          const stage = e.target.getStage();
          if (stage == null) return;
          e.evt.preventDefault();

          const pointerVector = stage.getPointerPosition();
          if (pointerVector == null) return;

          const pointerX = pointerVector.x;
          const pointerY = pointerVector.y;

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
        }}
        onMouseMove={(e: KonvaEventObject<MouseEvent>) => {
          const stage = e.target.getStage();
          if (stage == null || !selectionRectAttrs.isVisible) return;

          e.evt.preventDefault();

          const pointerVector = stage.getPointerPosition();
          if (pointerVector == null) return;

          const pointerX = pointerVector.x;
          const pointerY = pointerVector.y;

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
        }}
        onMouseUp={(e: KonvaEventObject<MouseEvent>) => {
          const stage = e.target.getStage();
          if (stage == null || !selectionRectAttrs.isVisible) return;
          e.evt.preventDefault();

          setTimeout(() => {
            setSelectionRectAttrs({
              ...selectionRectAttrs,
              isVisible: false,
            });
          });
        }}
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
            fill="green"
            shadowBlur={5}
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
        </Layer>
      </Stage>
    </div>
  );
};
