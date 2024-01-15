import useMapStore from '../../store/MapStore';
import { LayerConfigWithListenerRegister } from '../../types/layer-config';
import { isDrawingLayerActive } from '../../utils/layer-utils';
import { CreateDrawingAction, MoveDrawingAction, TransformDrawingAction } from './actions';
import BezierPolygon from './shapes/BezierPolygon';
import { DrawingDto, EllipseProperties, FreeLineProperties, RectangleProperties } from './types';
import { LayerType } from '@/api_types/definitions';
import Konva from 'konva';
import { KonvaEventListener, KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Ellipse, Layer, Line, Rect } from 'react-konva';
import * as uuid from 'uuid';

type DrawingLayerProps = LayerConfigWithListenerRegister;

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

type Line = {
  color: string;
  strokeWidth: number;
  x: number;
  y: number;
  points: number[][];
};

function DrawingLayer(props: DrawingLayerProps) {
  const drawingObjects = useMapStore((state) => state.trackedState.layers.drawing.objects);

  const selectedShape = useMapStore((state) => state.untrackedState.layers.drawing.shape);
  const selectedColor = useMapStore((state) => state.untrackedState.layers.drawing.selectedColor);
  const selectedStrokeWidth = useMapStore(
    (state) => state.untrackedState.layers.drawing.selectedStrokeWidth,
  );

  const setSingleNodeInTransformer = useMapStore((state) => state.setSingleNodeInTransformer);
  const addNodeToTransformer = useMapStore((state) => state.addNodeToTransformer);
  const removeNodeFromTransformer = useMapStore((state) => state.removeNodeFromTransformer);
  const selectDrawings = useMapStore((state) => state.selectDrawings);

  const { stageListenerRegister, ...layerProps } = props;

  const rectangles = drawingObjects
    .filter((object) => object.type === 'rectangle')
    .map((object) => {
      return {
        ...object,
        properties: object.properties as RectangleProperties,
      };
    });

  const ellipses = drawingObjects
    .filter((object) => object.type === 'ellipse')
    .map((object) => {
      return {
        ...object,
        properties: object.properties as EllipseProperties,
      };
    });

  const lines = drawingObjects
    .filter((object) => object.type === 'freeLine')
    .map((object) => {
      return {
        ...object,
        properties: object.properties as FreeLineProperties,
      };
    });

  const bezierLines = drawingObjects
    .filter((object) => object.type === 'bezierPolygon')
    .map((object) => {
      return {
        ...object,
        properties: object.properties as FreeLineProperties,
      };
    });

  const [newLine, setNewLine] = useState<Line>();
  const [newBezierLine, setNewBezierLine] = useState<Line>();

  const [previewRectangle, setPreviewRectangle] = useState<Rectangle | undefined>();
  const [previewEllipse, setPreviewEllipse] = useState<Ellipse | undefined>();

  const [activeBezierLine, setActiveBezierLine] = useState<string>();

  const isDrawing = useRef(false);

  const getSelectedLayerId = useMapStore((state) => state.getSelectedLayerId);
  const timelineDate = useMapStore((state) => state.untrackedState.timelineDate);
  const executeAction = useMapStore((state) => state.executeAction);

  const isShapeSelected = () => {
    return selectedShape !== null;
  };

  const createRectangle = useCallback(
    (rectangle: Rectangle) => {
      executeAction(
        new CreateDrawingAction({
          id: uuid.v4(),
          layerId: getSelectedLayerId() ?? -1,
          type: 'rectangle',
          rotation: 0,
          addDate: timelineDate,
          x: rectangle.x1,
          y: rectangle.y1,
          scaleX: 1,
          scaleY: 1,
          color: rectangle.color,
          properties: {
            width: rectangle.x2 - rectangle.x1,
            height: rectangle.y2 - rectangle.y1,
          },
        }),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const createEllipse = useCallback(
    (ellipse: Ellipse) => {
      executeAction(
        new CreateDrawingAction({
          id: uuid.v4(),
          layerId: getSelectedLayerId() ?? -1,
          rotation: 0,
          addDate: timelineDate,
          type: 'ellipse',
          scaleX: 1,
          scaleY: 1,
          x: ellipse.x,
          y: ellipse.y,
          color: ellipse.color,
          properties: {
            radiusX: ellipse.radiusX,
            radiusY: ellipse.radiusY,
          },
        }),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const createFreeLine = useCallback(
    (line: Line) => {
      executeAction(
        new CreateDrawingAction({
          id: uuid.v4(),
          layerId: getSelectedLayerId() ?? -1,
          rotation: 0,
          addDate: timelineDate,
          type: 'freeLine',
          scaleX: 1,
          scaleY: 1,
          x: line.x,
          y: line.y,
          color: line.color,
          properties: {
            strokeWidth: line.strokeWidth,
            points: line.points,
          },
        }),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const createBezierLine = useCallback(
    (line: Line) => {
      console.log(line);
      executeAction(
        new CreateDrawingAction({
          id: uuid.v4(),
          layerId: getSelectedLayerId() ?? -1,
          rotation: 0,
          addDate: timelineDate,
          type: 'bezierPolygon',
          scaleX: 1,
          scaleY: 1,
          x: line.x,
          y: line.y,
          color: line.color,
          properties: {
            strokeWidth: line.strokeWidth,
            points: line.points,
          },
        }),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const removePlantingFromSelection = (e: KonvaEventObject<MouseEvent>) => {
    const selectedDrawings = (foundDrawings: DrawingDto[], konvaNode: Konva.Node) => {
      const drawingNode = konvaNode.getAttr('object');
      return drawingNode ? [...foundDrawings, drawingNode] : [foundDrawings];
    };

    const getUpdatedDrawingSelection = () => {
      const transformer = useMapStore.getState().transformer.current;
      return transformer?.nodes().reduce(selectedDrawings, []) ?? [];
    };

    removeNodeFromTransformer(e.currentTarget);
    selectDrawings(getUpdatedDrawingSelection());
  };

  const addPlantingToSelection = (e: KonvaEventObject<MouseEvent>) => {
    addNodeToTransformer(e.currentTarget);

    const currentDrawingSelected =
      useMapStore.getState().untrackedState.layers.drawing.selectedDrawings ?? [];
    selectDrawings([...currentDrawingSelected, e.currentTarget.getAttr('object')]);
  };

  const handleMultiSelect = (e: KonvaEventObject<MouseEvent>, drawing: DrawingDto) => {
    isDrawingSelected(drawing) ? removePlantingFromSelection(e) : addPlantingToSelection(e);
  };

  const handleSingleSelect = (e: KonvaEventObject<MouseEvent>, drawing: DrawingDto) => {
    setSingleNodeInTransformer(e.currentTarget);
    selectDrawings([drawing]);
  };

  const handleShapeClicked = (e: KonvaEventObject<MouseEvent>) => {
    if (isShapeSelected()) return;

    isUsingModifierKey(e)
      ? handleMultiSelect(e, e.currentTarget.getAttr('object'))
      : handleSingleSelect(e, e.currentTarget.getAttr('object'));
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (!isShapeSelected || !isDrawingLayerActive()) return;

    if (e.target.getStage() == null) return;

    const stage = e.target.getStage();
    if (stage == null) return;

    const pos = stage.getRelativePointerPosition();
    if (pos == null) return;

    if (selectedShape == 'freeLine') {
      isDrawing.current = true;
      setNewLine({
        strokeWidth: selectedStrokeWidth,
        color: selectedColor,
        x: pos.x,
        y: pos.y,
        points: [[0, 0]],
      });
    } else if (selectedShape == 'rectangle') {
      isDrawing.current = true;
      setPreviewRectangle({ color: selectedColor, x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
    } else if (selectedShape == 'ellipse') {
      isDrawing.current = true;
      setPreviewEllipse({ color: selectedColor, x: pos.x, y: pos.y, radiusX: 0, radiusY: 0 });
    } else if (selectedShape == 'bezierPolygon') {
      if (!newBezierLine) {
        setNewBezierLine({
          color: selectedColor,
          strokeWidth: selectedStrokeWidth,
          x: pos.x,
          y: pos.y,
          points: [],
        });
      }
    }
  };

  const handleFinishBezierLine = () => {
    if (selectedShape == 'bezierPolygon') {
      if (newBezierLine) {
        createBezierLine(newBezierLine);
        setNewBezierLine(undefined);
      }
    }
  };

  const handleDrawLine = (point: Vector2d) => {
    if (!newLine) return;

    const flatPoints = newLine.points.flat();

    const distance = Math.sqrt(
      Math.pow(point.x - flatPoints[flatPoints.length - 2], 2) +
        Math.pow(point.y - flatPoints[flatPoints.length - 1], 2),
    );

    if (distance > 10) {
      setNewLine({
        ...newLine,
        points: [...newLine.points, [point.x - newLine.x, point.y - newLine.y]],
      });
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

    switch (selectedShape) {
      case 'freeLine':
        handleDrawLine(point);
        break;
      case 'rectangle':
        if (e.evt.shiftKey) {
          handleDrawSquare(point);
        } else {
          handleDrawRectangle(point);
        }
        break;
      case 'ellipse':
        if (e.evt.shiftKey) {
          handleDrawCircle(point);
        } else {
          handleDrawEllipse(point);
        }
        break;
    }
  };

  const handleMouseUp = () => {
    if (!isDrawingLayerActive()) return;
    isDrawing.current = false;

    switch (selectedShape) {
      case 'freeLine':
        handleFreeLineMouseUp();
        break;
      case 'rectangle':
        handleRectangleMouseUp();
        break;
      case 'ellipse':
        handleEllipseMouseUp();
        break;
    }
  };

  const handleFreeLineMouseUp = () => {
    if (!newLine) return;
    createFreeLine(newLine);
    setNewLine(undefined);
  };

  const handleRectangleMouseUp = () => {
    if (!previewRectangle) return;

    const newRect: Rectangle = {
      color: selectedColor,
      x1: Math.min(previewRectangle.x1, previewRectangle.x2),
      x2: Math.max(previewRectangle.x1, previewRectangle.x2),
      y1: Math.min(previewRectangle.y1, previewRectangle.y2),
      y2: Math.max(previewRectangle.y1, previewRectangle.y2),
    };

    setPreviewRectangle(undefined);
    createRectangle(newRect);
  };

  const handleEllipseMouseUp = () => {
    if (!previewEllipse) return;

    const newEllipse: Ellipse = {
      color: selectedColor,
      x: previewEllipse.x,
      y: previewEllipse.y,
      radiusX: previewEllipse.radiusX,
      radiusY: previewEllipse.radiusY,
    };

    setPreviewEllipse(undefined);
    createEllipse(newEllipse);
  };

  const moveToTop = (e: KonvaEventObject<MouseEvent>) => {
    e.target.moveToTop();
  };

  const handleSelectDrawing: KonvaEventListener<Konva.Stage, MouseEvent> = useCallback(() => {
    const selectedDrawings = (foundDrawings: DrawingDto[], konvaNode: Konva.Node) => {
      const drawingNode = konvaNode.getAttr('object');
      return drawingNode ? [...foundDrawings, drawingNode] : [foundDrawings];
    };

    const transformer = useMapStore.getState().transformer.current;
    const drawings = transformer?.nodes().reduce(selectedDrawings, []);

    if (drawings?.length) {
      useMapStore.getState().selectDrawings(drawings);
    }
  }, []);

  const handleTransformDrawing: KonvaEventListener<Konva.Transformer, unknown> = useCallback(() => {
    const updates = (useMapStore.getState().transformer.current?.getNodes() || []).map((node) => {
      return {
        id: node.id(),
        x: Math.round(node.x()),
        y: Math.round(node.y()),
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
      };
    });

    executeAction(new TransformDrawingAction(updates));
  }, [executeAction]);

  const handleMoveDrawing: KonvaEventListener<Konva.Transformer, unknown> = useCallback(() => {
    const transformer = useMapStore.getState().transformer.current;
    const selectedDrawings = transformer?.getNodes().filter((d) => d.attrs.object);

    if (!selectedDrawings || selectedDrawings.length == 0) return;

    console.log(selectDrawings);

    const updates = selectedDrawings.map((node) => {
      return {
        id: node.id(),
        x: Math.round(node.x()),
        y: Math.round(node.y()),
      };
    });

    executeAction(new MoveDrawingAction(updates));
  }, [executeAction, selectDrawings]);

  useEffect(() => {
    if (selectedShape != 'bezierPolygon' && newBezierLine) {
      createBezierLine(newBezierLine);
      setNewBezierLine(undefined);
    }
  }, [selectedShape]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!props.listening) {
      return;
    }
    stageListenerRegister.registerStageMouseDownListener('DrawingLayer', handleMouseDown);
    stageListenerRegister.registerStageMouseUpListener('DrawingLayer', handleMouseUp);
    stageListenerRegister.registerStageMouseMoveListener('DrawingLayer', handleMouseMove);
  }, [handleMouseDown, handleMouseMove, handleMouseUp]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!props.listening) {
      return;
    }
    useMapStore.getState().transformer.current?.on('dragend.drawings', handleMoveDrawing);
    useMapStore.getState().transformer.current?.on('transformend.drawings', handleTransformDrawing);
    useMapStore.getState().stageRef.current?.on('mouseup.selectDrawing', handleSelectDrawing);

    return () => {
      useMapStore.getState().transformer.current?.off('dragend.drawings');
      useMapStore.getState().transformer.current?.off('transformend.drawings');
      useMapStore.getState().stageRef.current?.off('mouseup.selectDrawing');
    };
  }, [handleMoveDrawing, handleTransformDrawing, handleSelectDrawing, props.listening]);

  const updateNewBezierLinePoints = (points: number[][]) => {
    if (!newBezierLine) return;

    setNewBezierLine({
      ...newBezierLine,
      points: points,
    });
  };

  const handleBezierLineClicked = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawingLayerActive() || isShapeSelected()) {
      return;
    }

    handleShapeClicked(e);

    if (e.target.attrs.object) {
      setActiveBezierLine(e.target.attrs.object.id);
    }
  };

  return (
    <>
      <Layer {...layerProps} name={`${LayerType.Drawing}`}>
        {bezierLines.map((bezierLine, i) => (
          <BezierPolygon
            key={`bezier-line-${i}`}
            object={bezierLine}
            onLineClick={handleBezierLineClicked}
            editModeActive={activeBezierLine === bezierLine.id}
            drawingModeActive={activeBezierLine === bezierLine.id}
            onPointsChanged={console.log}
            initialPoints={bezierLine.properties.points}
            strokeWidth={bezierLine.properties.strokeWidth}
            color={bezierLine.color}
          ></BezierPolygon>
        ))}

        {newBezierLine && (
          <BezierPolygon
            key={`new-bezier-line`}
            onFinishLine={handleFinishBezierLine}
            onPointsChanged={updateNewBezierLinePoints}
            initialPoints={newBezierLine.points}
            drawingModeActive={selectedShape == 'bezierPolygon'}
            editModeActive={selectedShape == 'bezierPolygon'}
            strokeWidth={selectedStrokeWidth}
            color={selectedColor}
          ></BezierPolygon>
        )}

        {lines.map((line, i) => (
          <Line
            id={line.id}
            listening={true}
            object={line}
            hitStrokeWidth={line.properties.strokeWidth + 100}
            key={i}
            x={line.x}
            y={line.y}
            scaleX={line.scaleX}
            scaleY={line.scaleY}
            points={line.properties.points.flat()}
            stroke={line.color}
            strokeWidth={line.properties.strokeWidth}
            tension={0.1}
            lineCap="round"
            lineJoin="round"
            onClick={handleShapeClicked}
            draggable
            onDragStart={moveToTop}
            bezier
          />
        ))}

        {newLine && (
          <Line
            listening={true}
            canBeDistorted={false}
            key={'new-line'}
            x={newLine.x}
            y={newLine.y}
            points={newLine.points.flat()}
            stroke={newLine.color}
            strokeWidth={newLine.strokeWidth}
            tension={0.2}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation="source-over"
          />
        )}

        {rectangles.map((rectangle, i) => (
          <Rect
            id={rectangle.id}
            canBeDistorted={true}
            listening={true}
            object={rectangle}
            cornerRadius={5}
            key={`rect-${i}`}
            x={rectangle.x}
            y={rectangle.y}
            width={rectangle.properties.width}
            height={rectangle.properties.height}
            stroke={rectangle.color}
            fill={rectangle.color}
            strokeWidth={5}
            scaleX={rectangle.scaleX}
            scaleY={rectangle.scaleY}
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
            id={ellipse.id}
            listening={true}
            object={ellipse}
            canBeDistorted={true}
            key={`ellipse-${i}`}
            x={ellipse.x}
            y={ellipse.y}
            scaleX={ellipse.scaleX}
            scaleY={ellipse.scaleY}
            radiusX={ellipse.properties.radiusX}
            radiusY={ellipse.properties.radiusY}
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

function isDrawingSelected(drawing: DrawingDto): boolean {
  const allSelectedDrawings = useMapStore.getState().untrackedState.layers.drawing.selectedDrawings;

  return Boolean(allSelectedDrawings?.find((selectedDrawing) => selectedDrawing.id === drawing.id));
}

function isUsingModifierKey(e: KonvaEventObject<MouseEvent>): boolean {
  return e.evt.ctrlKey || e.evt.shiftKey || e.evt.metaKey;
}

export default DrawingLayer;
