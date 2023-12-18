import useMapStore from '../../store/MapStore';
import { LayerConfigWithListenerRegister } from '../../types/layer-config';
import { isDrawingLayerActive } from '../../utils/layer-utils';
import { LayerType } from '@/api_types/definitions';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useEffect, useRef, useState } from 'react';
import { Ellipse, Layer, Line, Rect } from 'react-konva';

type DrawingLayerProps = LayerConfigWithListenerRegister;

type Line = {
  color: string;
  strokeWidth: number;
  points: number[];
};

type Rectangle = {
  color: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type Ellipse = {
  color: string;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
};

function DrawingLayer(props: DrawingLayerProps) {
  const shape = useMapStore((state) => state.untrackedState.layers.drawing.shape);

  const selectedColor = useMapStore((state) => state.untrackedState.layers.drawing.selectedColor);
  const selectedStrokeWidth = useMapStore(
    (state) => state.untrackedState.layers.drawing.selectedStrokeWidth,
  );

  const { stageListenerRegister, ...layerProps } = props;

  const [lines, setLines] = useState<Line[]>([]);

  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [previewRectangle, setPreviewRectangle] = useState<Rectangle | undefined>();

  const [ellipses, setEllipses] = useState<Ellipse[]>([]);
  const [previewEllipse, setPreviewEllipse] = useState<Ellipse | undefined>();

  const isDrawing = useRef(false);

  const isShapeSelected = () => {
    return shape !== null;
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (!isShapeSelected || !isDrawingLayerActive()) return;
    if (e.target.getStage() == null) return;

    isDrawing.current = true;

    const stage = e.target.getStage();
    if (stage == null) return;

    const pos = stage.getRelativePointerPosition();
    if (pos == null) return;

    if (shape == 'free') {
      setLines((prevLines) => [
        ...prevLines,
        { strokeWidth: selectedStrokeWidth, color: selectedColor, points: [pos.x, pos.y] },
      ]);
    } else if (shape == 'rectangle') {
      setPreviewRectangle({ color: selectedColor, x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
    } else if (shape == 'ellipse') {
      setPreviewEllipse({ color: selectedColor, x: pos.x, y: pos.y, radiusX: 0, radiusY: 0 });
    }
  };

  const handleDrawLine = (point: Vector2d) => {
    const lastLine = lines[lines.length - 1] || { points: [] };

    const distance = Math.sqrt(
      Math.pow(point.x - lastLine.points[lastLine.points.length - 2], 2) +
        Math.pow(point.y - lastLine.points[lastLine.points.length - 1], 2),
    );

    if (distance > 10) {
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      lines.splice(lines.length - 1, 1, lastLine);
      setLines([...lines]);
    }
  };

  const handleDrawRectangle = (point: Vector2d) => {
    if (!previewRectangle) return;
    setPreviewRectangle({
      color: selectedColor,
      x1: previewRectangle?.x1,
      y1: previewRectangle?.y1,
      x2: point.x,
      y2: point.y,
    });
  };

  const handleDrawSquare = (point: Vector2d) => {
    if (!previewRectangle) return;

    setPreviewRectangle({
      color: selectedColor,
      x1: previewRectangle?.x1,
      y1: previewRectangle?.y1,
      x2: point.x,
      y2: previewRectangle?.y1 + (point.x - previewRectangle?.x1),
    });
  };

  const handleDrawEllipse = (point: Vector2d) => {
    if (!previewEllipse) return;
    setPreviewEllipse({
      color: selectedColor,
      x: previewEllipse.x,
      y: previewEllipse.y,
      radiusX: Math.abs(point.x - previewEllipse.x),
      radiusY: Math.abs(point.y - previewEllipse.y),
    });
  };

  const handleDrawCircle = (point: Vector2d) => {
    if (!previewEllipse) return;

    const radius = Math.abs(point.x - previewEllipse.x);
    setPreviewEllipse({
      color: selectedColor,
      x: previewEllipse.x,
      y: previewEllipse.y,
      radiusX: radius,
      radiusY: radius,
    });
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawingLayerActive() || !isDrawing.current) {
      return;
    }

    const stage = e.target.getStage();
    if (stage == null) return;

    const point = stage.getRelativePointerPosition();
    if (point == null) return;

    if (shape === 'free') {
      handleDrawLine(point);
    } else if (shape == 'rectangle') {
      if (e.evt.shiftKey) {
        handleDrawSquare(point);
      } else {
        handleDrawRectangle(point);
      }
    } else if (shape === 'ellipse') {
      if (e.evt.shiftKey) {
        handleDrawCircle(point);
      } else {
        handleDrawEllipse(point);
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDrawingLayerActive()) return;
    isDrawing.current = false;

    if (shape == 'rectangle') {
      if (!previewRectangle) return;

      const newRect: Rectangle = {
        color: selectedColor,
        x1: Math.min(previewRectangle.x1, previewRectangle.x2),
        x2: Math.max(previewRectangle.x1, previewRectangle.x2),
        y1: Math.min(previewRectangle.y1, previewRectangle.y2),
        y2: Math.max(previewRectangle.y1, previewRectangle.y2),
      };

      setRectangles([...rectangles, newRect]);
      setPreviewRectangle(undefined);
    } else if (shape === 'ellipse') {
      if (!previewEllipse) return;

      const newEllipse: Ellipse = {
        color: selectedColor,
        x: previewEllipse.x,
        y: previewEllipse.y,
        radiusX: previewEllipse.radiusX,
        radiusY: previewEllipse.radiusY,
      };

      setEllipses([...ellipses, newEllipse]);
      setPreviewEllipse(undefined);
    }
  };

  const handleShapeClicked = (e: KonvaEventObject<MouseEvent>) => {
    const transformer = useMapStore.getState().transformer;
    transformer.current?.enabledAnchors([
      'top-left',
      'top-center',
      'top-right',
      'middle-left',
      'middle-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ]);

    useMapStore.getState().setSingleNodeInTransformer(e.target);
  };

  const moveToTop = (e: KonvaEventObject<MouseEvent>) => {
    e.target.moveToTop();
  };

  useEffect(() => {
    stageListenerRegister.registerStageMouseDownListener('DrawingLayer', handleMouseDown);
    stageListenerRegister.registerStageMouseUpListener('DrawingLayer', handleMouseUp);
    stageListenerRegister.registerStageMouseMoveListener('DrawingLayer', handleMouseMove);
  }, [handleMouseDown, handleMouseMove, handleMouseUp]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Layer {...layerProps} name={`${LayerType.Drawing}`}>
        {lines.map((line, i) => (
          <Line
            listening={true}
            key={i}
            points={line.points}
            stroke={line.color}
            strokeWidth={line.strokeWidth}
            tension={0.2}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation="source-over"
            onClick={handleShapeClicked}
            draggable
            onDragStart={moveToTop}
          />
        ))}

        {rectangles.map((rectangle, i) => (
          <Rect
            listening={true}
            cornerRadius={5}
            key={`rect-${i}`}
            x={rectangle.x1}
            y={rectangle.y1}
            width={rectangle.x2 - rectangle.x1}
            height={rectangle.y2 - rectangle.y1}
            stroke={rectangle.color}
            fill={rectangle.color}
            strokeWidth={5}
            onClick={handleShapeClicked}
            draggable
            onDragStart={moveToTop}
          ></Rect>
        ))}

        {previewRectangle && (
          <Rect
            cornerRadius={5}
            key={'preview-rect'}
            x={Math.min(previewRectangle.x1, previewRectangle.x2)}
            y={Math.min(previewRectangle.y1, previewRectangle.y2)}
            width={Math.abs(previewRectangle.x1 - previewRectangle.x2)}
            height={Math.abs(previewRectangle.y1 - previewRectangle.y2)}
            stroke={previewRectangle.color}
            strokeWidth={5}
          ></Rect>
        )}

        {ellipses.map((ellipse, i) => (
          <Ellipse
            listening={true}
            key={`ellipse-${i}`}
            x={ellipse.x}
            y={ellipse.y}
            radiusX={ellipse.radiusX}
            radiusY={ellipse.radiusY}
            stroke={ellipse.color}
            fill={ellipse.color}
            strokeWidth={5}
            onClick={handleShapeClicked}
            draggable
            onDragStart={moveToTop}
          />
        ))}

        {previewEllipse && (
          <Ellipse
            key="preview-ellipse"
            x={previewEllipse.x}
            y={previewEllipse.y}
            radiusX={previewEllipse.radiusX}
            radiusY={previewEllipse.radiusY}
            stroke={previewEllipse.color}
            strokeWidth={5}
          />
        )}
      </Layer>
    </>
  );
}

export default DrawingLayer;
